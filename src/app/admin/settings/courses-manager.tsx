"use client";

import { useState } from "react";
import { Save, Layout, Palette, Zap, Sparkles } from "lucide-react";
import { saveCoursesConfig } from "./actions";
import { toast } from "sonner";

export function CoursesManager({ currentConfig }: { currentConfig: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    title: currentConfig?.title || "Master the Sciences.",
    subtitle: currentConfig?.subtitle || "Structured pathways through the foundational texts of Islamic jurisprudence, theology, and linguistics.",
    layout: currentConfig?.layout || "3d-carousel",
    backgroundStyle: currentConfig?.backgroundStyle || "canvas",
    animationSpeed: currentConfig?.animationSpeed || "normal",
  });

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    Object.entries(config).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const result = await saveCoursesConfig(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Courses section settings updated");
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Section Title</label>
        <input 
          type="text" 
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Section Subtitle</label>
        <textarea 
          value={config.subtitle}
          onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
          className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456] min-h-[100px] resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-caption text-text-muted font-[600] uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4" /> Layout Style
          </label>
          <select 
            value={config.layout}
            onChange={(e) => setConfig({ ...config, layout: e.target.value })}
            className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
          >
            <option value="3d-carousel">3D Coverflow Carousel (Premium)</option>
            <option value="bento-grid">Bento Grid (Modern)</option>
            <option value="stack">Interactive Stack (Mobile-first)</option>
            <option value="standard">Standard Scroll (Classic)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-caption text-text-muted font-[600] uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" /> Background Style
          </label>
          <select 
            value={config.backgroundStyle}
            onChange={(e) => setConfig({ ...config, backgroundStyle: e.target.value })}
            className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
          >
            <option value="canvas">Standard Canvas (Light/Dark)</option>
            <option value="gradient-glow">Subtle Glowing Gradients</option>
            <option value="glassmorphism">Glassmorphism Blur</option>
            <option value="dark-premium">Deep Dark Premium</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-caption text-text-muted font-[600] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" /> Animation Speed
          </label>
          <select 
            value={config.animationSpeed}
            onChange={(e) => setConfig({ ...config, animationSpeed: e.target.value })}
            className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
          >
            <option value="slow">Slow & Majestic</option>
            <option value="normal">Normal (Smooth)</option>
            <option value="fast">Fast & Snappy</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-hairline-soft mt-2">
        <div className="flex items-center gap-2 text-caption text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Effects Enabled</span>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="component-button-primary flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Configuration</>
          )}
        </button>
      </div>
    </div>
  );
}
