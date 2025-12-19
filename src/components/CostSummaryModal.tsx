import {
  X,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface CostSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    totalTokens: number
    totalCost: number
    operations: number
    byModel: Record<string, { tokens: number; cost: number; count: number }>
    byOperation: Record<string, { tokens: number; cost: number; count: number }>
  }
  monthlyStats?: Record<
    string,
    { tokens: number; cost: number; operations: number }
  >
  currentMonthStats?: { tokens: number; cost: number; operations: number }
}

export function CostSummaryModal({
  isOpen,
  onClose,
  stats,
  monthlyStats,
  currentMonthStats,
}: CostSummaryModalProps) {
  const avgCost = stats.operations > 0 ? stats.totalCost / stats.operations : 0

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(2)}K`
    }
    return tokens.toString()
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(3)}m`
  }

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Sort monthly stats by date (newest first)
  const sortedMonthlyStats = monthlyStats
    ? Object.entries(monthlyStats).sort(([a], [b]) => b.localeCompare(a))
    : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white/95 backdrop-blur-xl border-white/20">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Token Usage & Cost Summary
                </h2>
                <p className="text-sm text-slate-600">
                  Real-time API usage tracking
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Total Tokens
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {formatTokens(stats.totalTokens)}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Total Cost
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {formatCost(stats.totalCost)}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Operations
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.operations}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Avg Cost
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {formatCost(avgCost)}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* By Model Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                By Model
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byModel).map(([model, data]) => (
                  <div
                    key={model}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{model}</p>
                      <p className="text-sm text-slate-600">
                        {data.count} {data.count === 1 ? 'call' : 'calls'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {formatTokens(data.tokens)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatCost(data.cost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* By Operation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                By Operation
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byOperation).map(([operation, data]) => (
                  <div
                    key={operation}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{operation}</p>
                      <p className="text-sm text-slate-600">
                        {data.count}{' '}
                        {data.count === 1 ? 'operation' : 'operations'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {formatTokens(data.tokens)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatCost(data.cost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Current Month Billing */}
          {currentMonthStats && currentMonthStats.operations > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Current Month (
                    {formatMonthLabel(
                      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
                    )}
                    )
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-xl bg-white/60 border border-amber-200">
                    <p className="text-sm text-slate-600 mb-1">Tokens</p>
                    <p className="text-xl font-bold text-slate-800">
                      {formatTokens(currentMonthStats.tokens)}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/60 border border-amber-200">
                    <p className="text-sm text-slate-600 mb-1">Cost</p>
                    <p className="text-xl font-bold text-slate-800">
                      {formatCost(currentMonthStats.cost)}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/60 border border-amber-200">
                    <p className="text-sm text-slate-600 mb-1">Operations</p>
                    <p className="text-xl font-bold text-slate-800">
                      {currentMonthStats.operations}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Monthly Billing Breakdown */}
          {sortedMonthlyStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Monthly Billing History
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {sortedMonthlyStats.map(([monthKey, data]) => (
                    <div
                      key={monthKey}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {formatMonthLabel(monthKey)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {data.operations}{' '}
                          {data.operations === 1 ? 'operation' : 'operations'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">
                          {formatCost(data.cost)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatTokens(data.tokens)} tokens
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-200/50 flex justify-end">
          <Button
            onClick={onClose}
            className="px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
