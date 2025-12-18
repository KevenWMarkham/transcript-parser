import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Zap, DollarSign, Activity, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { usageTracker, type UsageStats as UsageStatsType } from "../../utils/usageTracker";

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsageModal({ isOpen, onClose }: UsageModalProps) {
  const [stats, setStats] = useState<UsageStatsType>(usageTracker.getStats());

  useEffect(() => {
    const unsubscribe = usageTracker.subscribe((newStats) => {
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(0);
  };

  const formatCost = (cost: number): string => {
    if (cost < 0.01) {
      return `$${(cost * 1000).toFixed(3)}m`; // Show in millicents
    }
    return `$${cost.toFixed(4)}`;
  };

  const statCards = [
    {
      title: "Total Tokens",
      value: formatNumber(stats.totalTokens),
      icon: Zap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      borderColor: "border-blue-200/50",
    },
    {
      title: "Total Cost",
      value: formatCost(stats.totalCost),
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50/80 to-emerald-50/80",
      borderColor: "border-green-200/50",
    },
    {
      title: "Operations",
      value: stats.operationCount.toString(),
      icon: Activity,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50/80 to-pink-50/80",
      borderColor: "border-purple-200/50",
    },
    {
      title: "Avg Cost",
      value: stats.operationCount > 0 ? formatCost(stats.avgCostPerOperation) : "$0",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50/80 to-red-50/80",
      borderColor: "border-orange-200/50",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pb-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl"
          >
            <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl">Token Usage & Cost Summary</h2>
                      <p className="text-blue-100 text-sm mt-0.5">
                        Real-time API usage tracking
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {stats.totalTokens === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-slate-800 mb-2">No Usage Data Yet</h3>
                    <p className="text-sm text-slate-600">
                      Process a video to see token usage and cost statistics
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                          <motion.div
                            key={card.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`backdrop-blur-sm bg-gradient-to-br ${card.bgColor} rounded-2xl p-5 border ${card.borderColor}`}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm text-slate-600">{card.title}</span>
                            </div>
                            <div className="text-3xl text-slate-800 ml-0.5">{card.value}</div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Breakdown by Model */}
                    {stats.byModel.size > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-5"
                      >
                        <h3 className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          By Model
                        </h3>
                        <div className="space-y-3">
                          {Array.from(stats.byModel.entries()).map(([model, data], index) => (
                            <motion.div
                              key={model}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="backdrop-blur-sm bg-white/80 rounded-xl p-4 border border-slate-200/50 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {model}
                                </Badge>
                                <span className="text-xs text-slate-600">{data.count} operations</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-slate-600">
                                <span>{formatNumber(data.tokens)} tokens</span>
                                <span className="text-green-700">{formatCost(data.cost)}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Breakdown by Operation */}
                    {stats.byOperation.size > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          By Operation
                        </h3>
                        <div className="space-y-3">
                          {Array.from(stats.byOperation.entries()).map(([operation, data], index) => (
                            <motion.div
                              key={operation}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="backdrop-blur-sm bg-white/80 rounded-xl p-4 border border-slate-200/50 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-700 capitalize">
                                  {operation.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs text-slate-600">{data.count}x</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-slate-600">
                                <span>{formatNumber(data.tokens)} tokens</span>
                                <span className="text-green-700">{formatCost(data.cost)}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    💡 Pricing based on Google Gemini 2.5 Flash rates
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
