import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database.js'
import { transcripts, speakers, transcriptEntries } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler.js'

export const createTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const {
      title,
      description,
      fileName,
      fileSize,
      duration,
      videoFormat,
      model,
      speakersData,
      entries,
    } = req.body

    // Validate input
    if (!fileName || !speakersData || !entries) {
      throw new AppError(400, 'Missing required fields')
    }

    // Insert transcript
    const [transcript] = await db
      .insert(transcripts)
      .values({
        userId,
        title: title || fileName,
        description,
        fileName,
        fileSize: parseInt(fileSize),
        duration: duration?.toString(),
        videoFormat,
        model,
      })
      .returning()

    // Insert speakers
    const speakerRecords = await Promise.all(
      speakersData.map((speaker: any, index: number) =>
        db
          .insert(speakers)
          .values({
            transcriptId: transcript.id,
            speakerNumber: String(index + 1), // Convert to string: "1", "2", "3", etc.
            speakerName: speaker.name || speaker.speaker,
            color: speaker.color,
          })
          .returning()
      )
    )

    // Create speaker map for entries
    const speakerMap = new Map()
    speakerRecords.forEach(([speaker], index) => {
      speakerMap.set(speakersData[index].speaker, speaker.id)
    })

    // Insert entries
    await Promise.all(
      entries.map((entry: any, index: number) =>
        db.insert(transcriptEntries).values({
          transcriptId: transcript.id,
          speakerId: speakerMap.get(entry.speaker) || null,
          startTime: entry.startTime?.toString() || '0',
          endTime: entry.endTime?.toString() || '0',
          text: entry.text,
          confidence: entry.confidence?.toString(),
          entryOrder: index,
        })
      )
    )

    res.status(201).json({
      status: 'success',
      data: { transcriptId: transcript.id },
    })
  } catch (error) {
    next(error)
  }
}

export const getTranscripts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const userTranscripts = await db.query.transcripts.findMany({
      where: eq(transcripts.userId, userId),
      orderBy: [desc(transcripts.createdAt)],
      with: {
        speakers: true,
      },
    })

    res.json({
      status: 'success',
      data: { transcripts: userTranscripts },
    })
  } catch (error) {
    next(error)
  }
}

export const getTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const { id } = req.params

    const transcript = await db.query.transcripts.findFirst({
      where: and(eq(transcripts.id, id), eq(transcripts.userId, userId)),
      with: {
        speakers: true,
        entries: {
          orderBy: (entries, { asc }) => [asc(entries.entryOrder)],
        },
      },
    })

    if (!transcript) {
      throw new AppError(404, 'Transcript not found')
    }

    res.json({
      status: 'success',
      data: { transcript },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const { id } = req.params

    const transcript = await db.query.transcripts.findFirst({
      where: and(eq(transcripts.id, id), eq(transcripts.userId, userId)),
    })

    if (!transcript) {
      throw new AppError(404, 'Transcript not found')
    }

    await db.delete(transcripts).where(eq(transcripts.id, id))

    res.json({
      status: 'success',
      message: 'Transcript deleted',
    })
  } catch (error) {
    next(error)
  }
}
