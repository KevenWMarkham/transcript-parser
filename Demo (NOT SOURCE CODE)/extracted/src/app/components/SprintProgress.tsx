import { motion } from "motion/react";
import { CheckCircle, Circle, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

export function SprintProgress() {
  const phases = [
    {
      name: "Phase 1: Search & Filter",
      status: "complete",
      progress: 100,
      tasks: ["Debounced search", "Multi-filter system", "30 passing tests"],
    },
    {
      name: "Phase 2: Keyboard Navigation",
      status: "complete",
      progress: 75,
      tasks: ["Full keyboard nav", "Visual selection", "Help panel"],
    },
    {
      name: "Phase 3: Transcript Editing",
      status: "complete",
      progress: 75,
      tasks: ["Inline editing", "Edit history", "Visual indicators"],
    },
    {
      name: "Phase 4: Advanced Export",
      status: "complete",
      progress: 75,
      tasks: ["5 export formats", "Custom options", "Clipboard support"],
    },
    {
      name: "Phase 5: UX Polish",
      status: "pending",
      progress: 0,
      tasks: ["Accessibility", "Animations", "Dark mode"],
    },
    {
      name: "Phase 6: Performance",
      status: "pending",
      progress: 0,
      tasks: ["Virtualization", "Optimization", "Memoization"],
    },
  ];

  const completedTasks = phases.reduce(
    (acc, phase) => acc + (phase.status === "complete" ? 1 : 0),
    0
  );
  const totalTasks = phases.length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl blur opacity-50"></div>
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-slate-800">Sprint 5 Progress</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            {completedTasks}/{totalTasks} phases complete
          </p>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto text-sm bg-purple-100 text-purple-700 px-3 py-1.5"
        >
          {overallProgress}%
        </Badge>
      </div>

      <div className="space-y-3">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`backdrop-blur-sm rounded-xl p-4 border ${
              phase.status === "complete"
                ? "bg-green-50/60 border-green-200/50"
                : "bg-slate-50/60 border-slate-200/50"
            }`}
          >
            <div className="flex items-start gap-3">
              {phase.status === "complete" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-800">{phase.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      phase.status === "complete"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-slate-100 text-slate-600 border-slate-300"
                    }`}
                  >
                    {phase.progress}%
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tasks.map((task) => (
                    <span
                      key={task}
                      className="text-xs text-slate-600 bg-white/80 px-2 py-0.5 rounded-lg"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-6 pt-6 border-t border-slate-200/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-700">Overall Progress</span>
          <span className="text-sm text-purple-600">{overallProgress}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
