import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { openDB } from 'idb'
import type { TranscriptData } from '@transcript-parser/types'

interface TranscriptLibraryProps {
  onLoadTranscript?: (transcript: TranscriptData) => void
}

const DB_NAME = 'transcript-db'
const STORE_NAME = 'transcripts'

export function TranscriptLibrary({
  onLoadTranscript,
}: TranscriptLibraryProps) {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTranscripts()
  }, [])

  const loadTranscripts = async () => {
    try {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          }
        },
      })

      const allTranscripts = await db.getAll(STORE_NAME)
      setTranscripts(allTranscripts || [])
    } catch (error) {
      console.error('Failed to load transcripts:', error)
      setTranscripts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transcript?')) {
      try {
        const db = await openDB(DB_NAME, 1)
        await db.delete(STORE_NAME, id)
        await loadTranscripts()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  const handleLoad = async (id: string) => {
    try {
      const db = await openDB(DB_NAME, 1)
      const transcript = await db.get(STORE_NAME, id)
      if (transcript) {
        onLoadTranscript?.(transcript)
      }
    } catch (error) {
      console.error('Failed to load transcript:', error)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading transcripts...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        My Transcripts ({transcripts.length})
      </h2>

      <div className="grid gap-4">
        {transcripts.map(transcript => (
          <div
            key={transcript.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="font-semibold">{transcript.metadata.fileName || 'Untitled'}</h3>
            <p className="text-sm text-muted-foreground">
              {transcript.metadata.createdAt ? new Date(transcript.metadata.createdAt).toLocaleDateString() : 'Unknown date'} •{' '}
              {transcript.metadata.duration ? `${Math.floor(transcript.metadata.duration)}s` : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {transcript.speakers?.length || 0} speakers •{' '}
              {transcript.entries?.length || 0} entries
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => handleLoad(transcript.id)}>
                Load
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(transcript.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {transcripts.length === 0 && (
        <p className="text-center text-muted-foreground">No transcripts yet</p>
      )}
    </div>
  )
}
