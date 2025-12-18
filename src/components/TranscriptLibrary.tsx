import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/services/apiClient'

interface TranscriptLibraryProps {
  onLoadTranscript?: (transcript: any) => void
}

export function TranscriptLibrary({ onLoadTranscript }: TranscriptLibraryProps) {
  const [transcripts, setTranscripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTranscripts()
  }, [])

  const loadTranscripts = async () => {
    try {
      const { transcripts: data } = await apiClient.getTranscripts()
      setTranscripts(data)
    } catch (error) {
      console.error('Failed to load transcripts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transcript?')) {
      try {
        await apiClient.deleteTranscript(id)
        await loadTranscripts()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  const handleLoad = async (id: string) => {
    try {
      const { transcript } = await apiClient.getTranscript(id)
      onLoadTranscript?.(transcript)
    } catch (error) {
      console.error('Failed to load transcript:', error)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading transcripts...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Transcripts ({transcripts.length})</h2>

      <div className="grid gap-4">
        {transcripts.map((transcript) => (
          <div key={transcript.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold">{transcript.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(transcript.createdAt).toLocaleDateString()} • {transcript.duration ? `${transcript.duration}s` : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {transcript.speakers?.length || 0} speakers • {transcript.fileName}
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
