import { Response } from 'express'
import { eq, and, desc } from 'drizzle-orm'
import { AuthRequest } from '../middleware/auth'
import { db } from '../config/database'
import { transcripts, transcriptEntries, speakers, usageTracking } from '../models/schema'
import { extractAudio, getVideoDuration } from '../services/audioExtractor'
import { transcribeAudio } from '../services/geminiTranscription'
import path from 'path'
import fs from 'fs/promises'

export async function uploadAndTranscribe(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' })
  }

  const userId = req.user!.id
  const videoPath = req.file.path
  const title = req.body.title || req.file.originalname

  let transcriptId: number | undefined

  try {
    // Get video duration
    console.log('Getting video duration...')
    const duration = await getVideoDuration(videoPath)

    // Create transcript record
    console.log('Creating transcript record...')
    const [transcript] = await db.insert(transcripts).values({
      userId,
      title,
      videoFileName: req.file.originalname,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      duration: duration.toString(),
      status: 'processing'
    }).returning()

    transcriptId = transcript.id

    // Send initial response with transcript ID
    res.json({
      transcriptId: transcript.id,
      status: 'processing',
      message: 'Upload successful, processing started'
    })

    // Continue processing in background
    processTranscription(transcript.id, userId, videoPath).catch(err => {
      console.error('Background transcription error:', err)
    })

  } catch (error) {
    console.error('Upload error:', error)

    if (transcriptId) {
      await db.update(transcripts)
        .set({ status: 'failed' })
        .where(eq(transcripts.id, transcriptId))
    }

    if (!res.headersSent) {
      res.status(500).json({ error: 'Upload failed' })
    }
  }
}

async function processTranscription(transcriptId: number, userId: number, videoPath: string) {
  try {
    // Extract audio
    console.log('Extracting audio...')
    const audioDir = path.join(__dirname, '../../uploads/audio')
    const audioPath = await extractAudio(videoPath, audioDir)

    // Update with audio URL
    await db.update(transcripts)
      .set({ audioUrl: `/uploads/audio/${path.basename(audioPath)}` })
      .where(eq(transcripts.id, transcriptId))

    // Transcribe with Gemini
    console.log('Starting transcription...')
    const transcriptionResult = await transcribeAudio(audioPath)

    // Save speakers
    console.log('Saving speakers...')
    for (const speaker of transcriptionResult.speakers) {
      await db.insert(speakers).values({
        transcriptId,
        speakerNumber: speaker.id,
        name: speaker.name,
        color: speaker.color
      })
    }

    // Save transcript entries
    console.log('Saving transcript entries...')
    for (const entry of transcriptionResult.entries) {
      await db.insert(transcriptEntries).values({
        transcriptId,
        speakerNumber: entry.speakerNumber,
        speaker: entry.speaker,
        text: entry.text,
        startTime: entry.startTime.toString(),
        endTime: entry.endTime.toString(),
        confidence: entry.confidence.toString()
      })
    }

    // Track usage
    await db.insert(usageTracking).values({
      userId,
      model: transcriptionResult.metadata?.model || 'gemini-2.0-flash-exp',
      operation: 'Transcribe Video',
      inputTokens: transcriptionResult.metadata?.inputTokens || 0,
      outputTokens: transcriptionResult.metadata?.outputTokens || 0,
      estimatedCost: '0',
      metadata: JSON.stringify({
        entriesCount: transcriptionResult.entries.length,
        speakersCount: transcriptionResult.speakers.length
      })
    })

    // Update status to complete
    await db.update(transcripts)
      .set({
        status: 'complete',
        updatedAt: new Date()
      })
      .where(eq(transcripts.id, transcriptId))

    console.log('Transcription completed successfully')

  } catch (error) {
    console.error('Processing error:', error)

    // Update status to failed
    await db.update(transcripts)
      .set({
        status: 'failed',
        metadata: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
      })
      .where(eq(transcripts.id, transcriptId))
  }
}

export async function getTranscript(req: AuthRequest, res: Response) {
  try {
    const transcriptId = parseInt(req.params.id)
    const userId = req.user!.id

    // Get transcript
    const [transcript] = await db.select()
      .from(transcripts)
      .where(and(
        eq(transcripts.id, transcriptId),
        eq(transcripts.userId, userId)
      ))

    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Get entries
    const entries = await db.select()
      .from(transcriptEntries)
      .where(eq(transcriptEntries.transcriptId, transcriptId))
      .orderBy(transcriptEntries.startTime)

    // Get speakers
    const speakersList = await db.select()
      .from(speakers)
      .where(eq(speakers.transcriptId, transcriptId))

    res.json({
      ...transcript,
      entries,
      speakers: speakersList
    })
  } catch (error) {
    console.error('Get transcript error:', error)
    res.status(500).json({ error: 'Failed to get transcript' })
  }
}

export async function listTranscripts(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id

    const transcriptsList = await db.select({
      id: transcripts.id,
      title: transcripts.title,
      videoFileName: transcripts.videoFileName,
      duration: transcripts.duration,
      status: transcripts.status,
      createdAt: transcripts.createdAt,
      updatedAt: transcripts.updatedAt
    })
      .from(transcripts)
      .where(eq(transcripts.userId, userId))
      .orderBy(desc(transcripts.createdAt))

    res.json(transcriptsList)
  } catch (error) {
    console.error('List transcripts error:', error)
    res.status(500).json({ error: 'Failed to list transcripts' })
  }
}

export async function deleteTranscript(req: AuthRequest, res: Response) {
  try {
    const transcriptId = parseInt(req.params.id)
    const userId = req.user!.id

    // Verify ownership
    const [transcript] = await db.select()
      .from(transcripts)
      .where(and(
        eq(transcripts.id, transcriptId),
        eq(transcripts.userId, userId)
      ))

    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Delete entries and speakers (cascade)
    await db.delete(transcriptEntries).where(eq(transcriptEntries.transcriptId, transcriptId))
    await db.delete(speakers).where(eq(speakers.transcriptId, transcriptId))

    // Delete transcript
    await db.delete(transcripts).where(eq(transcripts.id, transcriptId))

    // Delete files if they exist
    if (transcript.videoUrl) {
      const videoPath = path.join(__dirname, '../../', transcript.videoUrl)
      await fs.unlink(videoPath).catch(() => {}) // Ignore errors
    }
    if (transcript.audioUrl) {
      const audioPath = path.join(__dirname, '../../', transcript.audioUrl)
      await fs.unlink(audioPath).catch(() => {}) // Ignore errors
    }

    res.json({ message: 'Transcript deleted successfully' })
  } catch (error) {
    console.error('Delete transcript error:', error)
    res.status(500).json({ error: 'Failed to delete transcript' })
  }
}

export async function updateEntry(req: AuthRequest, res: Response) {
  try {
    const transcriptId = parseInt(req.params.id)
    const entryId = parseInt(req.params.entryId)
    const userId = req.user!.id
    const { text, speaker } = req.body

    // Verify transcript ownership
    const [transcript] = await db.select()
      .from(transcripts)
      .where(and(
        eq(transcripts.id, transcriptId),
        eq(transcripts.userId, userId)
      ))

    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Update entry
    const updates: any = {}
    if (text !== undefined) updates.text = text
    if (speaker !== undefined) updates.speaker = speaker

    const [updatedEntry] = await db.update(transcriptEntries)
      .set(updates)
      .where(and(
        eq(transcriptEntries.id, entryId),
        eq(transcriptEntries.transcriptId, transcriptId)
      ))
      .returning()

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    res.json(updatedEntry)
  } catch (error) {
    console.error('Update entry error:', error)
    res.status(500).json({ error: 'Failed to update entry' })
  }
}
