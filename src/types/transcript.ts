export interface TranscriptEntry {
  id: string
  speaker: string
  speakerNumber: number
  startTime: string
  endTime: string
  text: string
  confidence?: number
}

export interface TranscriptData {
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata?: {
    duration: string
    createdAt: string
    fileName: string
  }
}

export interface Speaker {
  id: number
  name: string
  color: string
}
