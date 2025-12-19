import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export interface TranscriptEntry {
  speaker: string
  speakerNumber: number
  text: string
  startTime: number
  endTime: number
  confidence: number
}

export interface Speaker {
  id: number
  name: string
  color: string
}

export interface TranscriptionResult {
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata?: {
    model: string
    inputTokens?: number
    outputTokens?: number
  }
}

export async function transcribeAudio(audioPath: string): Promise<TranscriptionResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Read audio file
    const audioData = await fs.readFile(audioPath)
    const audioBase64 = audioData.toString('base64')

    const prompt = `Transcribe this audio file with speaker diarization. Return ONLY a valid JSON object with this exact structure:

{
  "entries": [
    {
      "speaker": "Speaker 1",
      "speakerNumber": 1,
      "text": "The actual spoken text",
      "startTime": 0.00,
      "endTime": 5.23,
      "confidence": 0.95
    }
  ],
  "speakers": [
    {
      "id": 1,
      "name": "Speaker 1",
      "color": "blue"
    }
  ]
}

Requirements:
1. Identify different speakers and assign them numbers (1, 2, 3, etc.)
2. Format times in seconds with 2 decimal places
3. Assign colors from: blue, emerald, purple, orange, pink, cyan
4. Use confidence scores between 0.0 and 1.0
5. Return ONLY valid JSON, no markdown formatting or additional text
6. Break the transcript into logical segments based on speaker turns and pauses`

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: audioBase64
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    // Remove markdown code blocks if present
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    // Parse JSON response
    const transcriptData = JSON.parse(jsonText)

    // Validate the response structure
    if (!transcriptData.entries || !Array.isArray(transcriptData.entries)) {
      throw new Error('Invalid transcription response: missing entries array')
    }
    if (!transcriptData.speakers || !Array.isArray(transcriptData.speakers)) {
      throw new Error('Invalid transcription response: missing speakers array')
    }

    // Get usage metadata if available
    const usageMetadata = response.usageMetadata

    return {
      entries: transcriptData.entries,
      speakers: transcriptData.speakers,
      metadata: {
        model: 'gemini-2.0-flash-exp',
        inputTokens: usageMetadata?.promptTokenCount,
        outputTokens: usageMetadata?.candidatesTokenCount
      }
    }
  } catch (error) {
    console.error('Gemini transcription error:', error)
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fallback function for testing without Gemini API
export function createMockTranscription(duration: number): TranscriptionResult {
  const mockEntries: TranscriptEntry[] = [
    {
      speaker: 'Speaker 1',
      speakerNumber: 1,
      text: 'Hello, this is a test transcription.',
      startTime: 0,
      endTime: 3.5,
      confidence: 0.95
    },
    {
      speaker: 'Speaker 2',
      speakerNumber: 2,
      text: 'Yes, I can hear you clearly.',
      startTime: 3.5,
      endTime: 6.8,
      confidence: 0.92
    }
  ]

  const mockSpeakers: Speaker[] = [
    { id: 1, name: 'Speaker 1', color: 'blue' },
    { id: 2, name: 'Speaker 2', color: 'emerald' }
  ]

  return {
    entries: mockEntries,
    speakers: mockSpeakers,
    metadata: {
      model: 'mock',
      inputTokens: 0,
      outputTokens: 0
    }
  }
}
