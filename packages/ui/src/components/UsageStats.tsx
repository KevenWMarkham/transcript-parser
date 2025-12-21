import { useMemo } from 'react'
import { DollarSign, Zap, Activity, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface UsageStatsProps {
  userId: number
  stats: {
    totalTokens: number
    totalCost: number
    operations: number
    byModel: Record<string, { tokens: number; cost: number; count: number }>
    byOperation: Record<string, { tokens: number; cost: number; count: number }>
  }
}

export function UsageStats({ userId, stats }: UsageStatsProps) {
  const formattedCost = useMemo(
    () => `$${stats.totalCost.toFixed(4)}`,
    [stats.totalCost]
  )

  const formattedTokens = useMemo(() => {
    if (stats.totalTokens >= 1_000_000) {
      return `${(stats.totalTokens / 1_000_000).toFixed(2)}M`
    } else if (stats.totalTokens >= 1_000) {
      return `${(stats.totalTokens / 1_000).toFixed(1)}K`
    }
    return stats.totalTokens.toString()
  }, [stats.totalTokens])

  const avgCostPerOperation = useMemo(
    () =>
      stats.operations > 0
        ? `$${(stats.totalCost / stats.operations).toFixed(4)}`
        : '$0.0000',
    [stats.totalCost, stats.operations]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          LLM Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Tokens
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formattedTokens}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {stats.operations} operations
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Total Cost
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {formattedCost}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
              {avgCostPerOperation} avg/op
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Operations
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.operations}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              API calls made
            </div>
          </div>
        </div>

        {/* By Model Breakdown */}
        {Object.keys(stats.byModel).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Usage by Model</h4>
            <div className="space-y-2">
              {Object.entries(stats.byModel).map(([model, data]) => (
                <div
                  key={model}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{model}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {data.count} {data.count === 1 ? 'call' : 'calls'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${data.cost.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.tokens >= 1000
                        ? `${(data.tokens / 1000).toFixed(1)}K tokens`
                        : `${data.tokens} tokens`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Operation Breakdown */}
        {Object.keys(stats.byOperation).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Usage by Operation</h4>
            <div className="space-y-2">
              {Object.entries(stats.byOperation).map(([operation, data]) => (
                <div
                  key={operation}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{operation}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {data.count} {data.count === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${data.cost.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.tokens >= 1000
                        ? `${(data.tokens / 1000).toFixed(1)}K tokens`
                        : `${data.tokens} tokens`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.operations === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No usage data yet</p>
            <p className="text-xs mt-1">
              Usage will appear after your first transcription
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
