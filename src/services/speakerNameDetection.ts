/**
 * Speaker Name Detection Service
 * Uses Gemini AI to detect speaker names from transcript content
 */

import { GoogleGenAI } from '@google/genai'
import { usageTracker } from '@/services/usageTracker'
import { apiClient } from '@/services/apiClient'
import type { TranscriptEntry, Speaker } from '@/types/transcript'

export interface DetectedSpeakerName {
  speakerId: number
  detectedName: string
  confidence: 'high' | 'medium' | 'low'
  evidence: string // The text that led to this detection
}

export class SpeakerNameDetectionService {
  private ai: GoogleGenAI
  private model: string

  constructor(apiKey?: string) {
    // Get API key from localStorage or environment
    let key = apiKey

    if (!key) {
      try {
        const stored = localStorage.getItem('gemini_api_config')
        if (stored) {
          const config = JSON.parse(stored)
          if (config.mode === 'own' && config.ownKey) {
            key = config.ownKey
          } else if (config.mode === 'code' && config.accessCode) {
            // In code mode, use developer's API key from environment
            key = import.meta.env.VITE_GEMINI_API_KEY
          }
        }
      } catch (error) {
        console.warn('Failed to load API config from localStorage:', error)
      }
    }

    // Fall back to environment variable
    if (!key) {
      key = import.meta.env.VITE_GEMINI_API_KEY
    }

    if (!key) {
      throw new Error('Gemini API key is required for speaker name detection')
    }

    this.ai = new GoogleGenAI({ apiKey: key })
    this.model = 'gemini-2.5-flash'
  }

  /**
   * Detect speaker names from transcript entries
   */
  async detectSpeakerNames(
    entries: TranscriptEntry[],
    speakers: Speaker[]
  ): Promise<DetectedSpeakerName[]> {
    // Group entries by speaker
    const speakerEntries = new Map<number, TranscriptEntry[]>()

    for (const entry of entries) {
      if (!speakerEntries.has(entry.speakerNumber)) {
        speakerEntries.set(entry.speakerNumber, [])
      }
      speakerEntries.get(entry.speakerNumber)!.push(entry)
    }

    // Analyze each speaker's dialogue
    const detectionPromises = Array.from(speakerEntries.entries()).map(
      async ([speakerNumber, speakerTexts]) => {
        return await this.detectNameForSpeaker(
          speakerNumber,
          speakerTexts,
          speakers.find(s => s.id === speakerNumber)?.name ||
            `Speaker ${speakerNumber}`
        )
      }
    )

    const results = await Promise.all(detectionPromises)

    // Filter out null results (no name detected)
    return results.filter((r): r is DetectedSpeakerName => r !== null)
  }

  /**
   * Detect name for a single speaker
   */
  private async detectNameForSpeaker(
    speakerId: number,
    entries: TranscriptEntry[],
    currentName: string
  ): Promise<DetectedSpeakerName | null> {
    // Take first few entries (where introductions typically happen)
    const earlyEntries = entries.slice(0, Math.min(10, entries.length))
    const allEntries = entries.slice(0, Math.min(30, entries.length))

    // Combine text
    const earlyText = earlyEntries.map(e => e.text).join(' ')
    const fullText = allEntries.map(e => e.text).join(' ')

    const prompt = `Analyze this transcript excerpt from ${currentName} and determine if they introduce themselves with their actual name.

Early dialogue (most likely to contain introduction):
"${earlyText}"

Additional context:
"${fullText}"

Look for patterns like:
- "My name is [name]"
- "I'm [name]"
- "This is [name]"
- "Hi, I'm [name]"
- "[name] here"
- Other self-introduction patterns

Return ONLY a JSON object with this exact structure (no markdown, no code blocks, no explanation):
{
  "nameDetected": true or false,
  "name": "detected name or null",
  "confidence": "high", "medium", or "low",
  "evidence": "the exact quote where they introduced themselves"
}

Rules:
- Only detect if the speaker clearly introduces THEMSELVES
- Don't detect if they're talking ABOUT someone else
- Don't detect pronouns or generic terms
- Confidence should be "high" only if very clear (e.g., "My name is John")
- Confidence should be "medium" for less formal introductions (e.g., "I'm Sarah")
- Confidence should be "low" for ambiguous cases
- Return nameDetected: false if no clear self-introduction found

Example outputs:
{"nameDetected": true, "name": "John Smith", "confidence": "high", "evidence": "My name is John Smith"}
{"nameDetected": true, "name": "Sarah", "confidence": "medium", "evidence": "Hi everyone, I'm Sarah"}
{"nameDetected": false, "name": null, "confidence": "low", "evidence": ""}
`

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      })

      const text = response.text?.trim()

      if (!text) {
        return null
      }

      // Track usage and cost
      const usageMetadata = response.usageMetadata
      if (usageMetadata) {
        const currentUser = apiClient.getCurrentUser()
        if (currentUser) {
          usageTracker.track({
            userId: currentUser.id || 1,
            model: this.model,
            operation: 'Speaker Name Detection',
            inputTokens: usageMetadata.promptTokenCount || 0,
            outputTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
            metadata: {
              speakerId,
              speakerName: currentName,
            },
          })
        }
      }

      // Parse response
      const cleaned = text
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/, '')
        .trim()
      const result = JSON.parse(cleaned)

      if (result.nameDetected && result.name) {
        return {
          speakerId,
          detectedName: result.name,
          confidence: result.confidence || 'low',
          evidence: result.evidence || '',
        }
      }

      return null
    } catch (error) {
      console.error(`Failed to detect name for speaker ${speakerId}:`, error)
      return null
    }
  }
}
