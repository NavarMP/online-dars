"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { saveStatsConfig } from "./actions";

export interface StatItem {
  id: string;
  value: number;
  label: string;
  suffix?: string;
}

export function StatsManager({ currentConfig }: { currentConfig?: any }) {
  const [stats, setStats] = useState<StatItem[]>(
    currentConfig?.stats || [
      { id: "1", value: 12, label: "Classical Texts", suffix: "" },
      { id: "2", value: 45, label: "Course Sessions", suffix: "" },
      { id: "3", value: 850, label: "Active Students", suffix: "+" },
      { id: "4", value: 4, label: "Expert Instructors", suffix: "" },
    ]
  );
  const [isSaving, setIsSaving] = useState(false);

  const addStat = () => {
    setStats([...stats, { id: Date.now().toString(), value: 0, label: "New Stat", suffix: "" }]);
  };

  const removeStat = (id: string) => {
    setStats(stats.filter(s => s.id !== id));
  };

  const updateStat = (id: string, field: keyof StatItem, value: any) => {
    setStats(stats.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const moveStat = (index: number, direction: "up" | "down") => {
    const newStats = [...stats];
    if (direction === "up" && index > 0) {
      const temp = newStats[index - 1];
      newStats[index - 1] = newStats[index];
      newStats[index] = temp;
    } else if (direction === "down" && index < newStats.length - 1) {
      const temp = newStats[index + 1];
      newStats[index + 1] = newStats[index];
      newStats[index] = temp;
    }
    setStats(newStats);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveStatsConfig({ stats, style: currentConfig?.style || "default" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-4 p-4 border border-hairline-soft rounded-sm bg-field/50"
            >
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => moveStat(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-text-muted hover:text-ink disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveStat(index, "down")}
                  disabled={index === stats.length - 1}
                  className="p-1 text-text-muted hover:text-ink disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, "value", Number(e.target.value))}
                    className="bg-canvas border border-hairline-soft rounded-sm px-4 py-2 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix || ""}
                    onChange={(e) => updateStat(stat.id, "suffix", e.target.value)}
                    placeholder="e.g. +, k, M"
                    className="bg-canvas border border-hairline-soft rounded-sm px-4 py-2 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-1">
                  <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                    className="bg-canvas border border-hairline-soft rounded-sm px-4 py-2 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
                  />
                </div>
              </div>

              <button
                onClick={() => removeStat(stat.id)}
                className="p-2 mt-7 text-text-muted hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={addStat}
          className="flex items-center gap-2 text-body-sm text-ink hover:text-ink-soft transition-colors font-[500]"
        >
          <Plus className="w-4 h-4" /> Add Counter
        </button>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="component-button-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
