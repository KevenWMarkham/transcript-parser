/**
 * MSW (Mock Service Worker) handlers for API mocking
 * Used in tests to mock Gemini API responses
 */

import { http, HttpResponse } from 'msw'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com'

/**
 * Mock successful transcription response
 */
const mockSuccessResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify([
              {
                speaker: 'Speaker 1',
                speakerNumber: 1,
                startTime: 0.0,
                endTime: 5.2,
                text: 'Hello everyone, welcome to the meeting.',
                confidence: 0.95,
              },
              {
                speaker: 'Speaker 2',
                speakerNumber: 2,
                startTime: 5.2,
                endTime: 10.5,
                text: 'Thanks for having me.',
                confidence: 0.93,
              },
              {
                speaker: 'Speaker 1',
                speakerNumber: 1,
                startTime: 10.5,
                endTime: 15.0,
                text: "Let's get started with the agenda.",
                confidence: 0.97,
              },
            ]),
          },
        ],
      },
    },
  ],
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 50,
    totalTokenCount: 150,
  },
}

/**
 * Mock response with markdown code blocks (tests cleanup)
 */
const mockMarkdownResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: `\`\`\`json
${JSON.stringify([
  {
    speaker: 'Speaker 1',
    speakerNumber: 1,
    startTime: 0.0,
    endTime: 3.0,
    text: 'Test with markdown.',
    confidence: 0.9,
  },
])}
\`\`\``,
          },
        ],
      },
    },
  ],
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 50,
    totalTokenCount: 150,
  },
}

/**
 * Default handlers for Gemini API
 */
export const handlers = [
  // Successful transcription
  http.post(`${GEMINI_API_BASE}/v1beta/models/:model/generateContent`, () => {
    return HttpResponse.json(mockSuccessResponse)
  }),
]

/**
 * Handler for quota exceeded error
 */
export const quotaExceededHandler = http.post(
  `${GEMINI_API_BASE}/v1beta/models/:model/generateContent`,
  () => {
    return HttpResponse.json(
      {
        error: {
          code: 429,
          message: 'Resource has been exhausted (e.g. check quota).',
          status: 'RESOURCE_EXHAUSTED',
        },
      },
      { status: 429 }
    )
  }
)

/**
 * Handler for invalid audio error
 */
export const invalidAudioHandler = http.post(
  `${GEMINI_API_BASE}/v1beta/models/:model/generateContent`,
  () => {
    return HttpResponse.json(
      {
        error: {
          code: 400,
          message: 'Invalid audio format or corrupted file.',
          status: 'INVALID_ARGUMENT',
        },
      },
      { status: 400 }
    )
  }
)

/**
 * Handler for markdown response
 */
export const markdownResponseHandler = http.post(
  `${GEMINI_API_BASE}/v1beta/models/:model/generateContent`,
  () => {
    return HttpResponse.json(mockMarkdownResponse)
  }
)

/**
 * Handler for empty response
 */
export const emptyResponseHandler = http.post(
  `${GEMINI_API_BASE}/v1beta/models/:model/generateContent`,
  () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [{ text: '' }],
          },
        },
      ],
      usageMetadata: {
        promptTokenCount: 100,
        candidatesTokenCount: 0,
        totalTokenCount: 100,
      },
    })
  }
)

/**
 * Handler for network error
 */
export const networkErrorHandler = http.post(
  `${GEMINI_API_BASE}/v1beta/models/:model/generateContent`,
  () => {
    return HttpResponse.error()
  }
)
