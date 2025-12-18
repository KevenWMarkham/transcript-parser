import { Wand2, CheckCircle2, Upload as UploadIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StatusStep {
  title: string
  description: string
  completed: boolean
}

export function ProcessingStatus() {
  // Mock data - replace with actual state
  const steps: StatusStep[] = [
    {
      title: 'Uploading video',
      description: 'Upload successful',
      completed: true,
    },
    {
      title: 'Transcription complete',
      description: 'All speakers identified successfully',
      completed: true,
    },
  ]

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Processing Status</h2>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{step.title}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={() => {
            /* Handle process another video */
          }}
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          Process Another Video
        </Button>
      </CardContent>
    </Card>
  )
}
