import { useState } from 'react'
import { Info } from 'lucide-react'

export interface VersionInfo {
  version: string
  fullVersion: string
  build: {
    date: string
    time: string
    environment: string
    branch: string
    commit: string
  }
  features?: Record<string, boolean | string>
}

interface VersionBadgeProps {
  versionInfo: VersionInfo
  position?: 'bottom-right' | 'bottom-left' | 'inline'
  showDetails?: boolean
}

export function VersionBadge({
  versionInfo,
  position = 'bottom-right',
  showDetails = false,
}: VersionBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    inline: 'relative',
  }

  const envColors: Record<string, string> = {
    production: 'bg-emerald-500',
    development: 'bg-amber-500',
    staging: 'bg-blue-500',
    test: 'bg-purple-500',
  }

  const envColor = envColors[versionInfo.build.environment] || 'bg-slate-500'

  return (
    <div className={positionClasses[position]}>
      {/* Collapsed Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-slate-800/90 backdrop-blur-sm text-white text-xs font-medium
          shadow-lg hover:bg-slate-700/90 transition-all
          border border-slate-700/50
        `}
        title="Click for version details"
      >
        <span className={`w-2 h-2 rounded-full ${envColor}`} />
        <span>{versionInfo.fullVersion}</span>
        {showDetails && <Info className="w-3 h-3 opacity-60" />}
      </button>

      {/* Expanded Details Panel */}
      {isExpanded && showDetails && (
        <div
          className={`
            absolute ${position === 'bottom-left' ? 'left-0' : 'right-0'} bottom-full mb-2
            bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl
            border border-slate-700/50 p-4 min-w-[280px]
            text-white text-xs
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Version Info</h4>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Version:</span>
              <span className="font-mono">{versionInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Environment:</span>
              <span className={`px-2 py-0.5 rounded ${envColor}`}>
                {versionInfo.build.environment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Build Date:</span>
              <span className="font-mono">{versionInfo.build.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Branch:</span>
              <span className="font-mono">{versionInfo.build.branch}</span>
            </div>
            {versionInfo.build.commit !== 'local' && (
              <div className="flex justify-between">
                <span className="text-slate-400">Commit:</span>
                <span className="font-mono">{versionInfo.build.commit}</span>
              </div>
            )}
          </div>

          {versionInfo.features &&
            Object.keys(versionInfo.features).length > 0 && (
              <>
                <div className="border-t border-slate-700 my-3" />
                <h5 className="text-slate-400 mb-2">Features</h5>
                <div className="space-y-1">
                  {Object.entries(versionInfo.features).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span>
                        {typeof value === 'boolean' ? (
                          value ? (
                            <span className="text-emerald-400">●</span>
                          ) : (
                            <span className="text-red-400">○</span>
                          )
                        ) : (
                          <span className="font-mono">{value}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

          <div className="border-t border-slate-700 mt-3 pt-3 text-center text-slate-500">
            SmartHaven AI Platform
          </div>
        </div>
      )}
    </div>
  )
}
