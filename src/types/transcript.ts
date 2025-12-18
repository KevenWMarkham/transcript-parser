export interface TranscriptEntry {
  id: string
  speaker: string
  speakerNumber: number
  startTime: number // seconds (decimal)
  endTime: number // seconds (decimal)
  text: string
  confidence?: number
}

export interface TranscriptData {
  id: string
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata: {
    fileName: string
    fileSize: number
    duration: number // seconds
    createdAt: string
    processedAt: string
    videoFormat: string
    model: string
  }
}

export interface Speaker {
  id: number
  name: string
  color: string
}
