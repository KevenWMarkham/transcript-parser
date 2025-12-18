import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, Zap, DollarSign, Activity } from "lucide-react";
import { Badge } from "./ui/badge";
import { usageTracker, type UsageStats as UsageStatsType } from "../../utils/usageTracker";

export function UsageStats() {
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

  if (stats.totalTokens === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-slate-800">Token Usage & Costs</h2>
            <p className="text-sm text-slate-600 mt-0.5">No usage data yet</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center py-8">
          Process a video to see token usage and cost statistics
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-slate-800">Token Usage & Costs</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Real-time API usage tracking
            </p>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-sm bg-gradient-to-br ${card.bgColor} rounded-2xl p-4 border ${card.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs text-slate-600">{card.title}</span>
                </div>
                <div className="text-2xl text-slate-800 ml-0.5">{card.value}</div>
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
            className="mb-4"
          >
            <h3 className="text-sm text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              By Model
            </h3>
            <div className="space-y-2">
              {Array.from(stats.byModel.entries()).map(([model, data], index) => (
                <motion.div
                  key={model}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="backdrop-blur-sm bg-white/60 rounded-xl p-3 border border-slate-200/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {model}
                    </Badge>
                    <span className="text-xs text-slate-600">{data.count} ops</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
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
            <div className="space-y-2">
              {Array.from(stats.byOperation.entries()).map(([operation, data], index) => (
                <motion.div
                  key={operation}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="backdrop-blur-sm bg-white/60 rounded-xl p-3 border border-slate-200/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-700">{operation.replace(/_/g, " ")}</span>
                    <span className="text-xs text-slate-600">{data.count}x</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{formatNumber(data.tokens)} tokens</span>
                    <span className="text-green-700">{formatCost(data.cost)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
