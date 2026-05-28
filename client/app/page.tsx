"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Droplets, Sparkles } from "lucide-react";
import { DiseaseCard } from "@/components/ui/DiseaseCard";
import { useRef, useCallback } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/* Horizontal scroll hook for mobile cards */
function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const onWheel = useCallback((e: React.WheelEvent) => {
    if (ref.current && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  }, []);
  return { ref, onWheel };
}

export default function Home() {
  const cardsScroll = useHorizontalScroll();

  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Inline CSS for hiding scrollbars on carousels */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none !important; }
        .hide-scroll { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}} />

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="min-h-full flex flex-col justify-center relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Powered by Advanced Machine Learning
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Medi<span className="text-emerald-600 dark:text-emerald-500">Assist</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed px-2">
            Early detection saves lives. Use our AI-powered tools to assess your risk for Diabetes, Heart Disease, and Parkinson's in seconds.
          </p>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-6"
        >
          <DiseaseCard
            href="/diabetes"
            title="Diabetes"
            description="Analyze glucose levels, BMI, and other biomarkers to predict diabetes risk."
            icon={<Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />}
            colorClass="group-hover:border-blue-500/50"
            bgClass="group-hover:bg-blue-500/5"
          />

          <DiseaseCard
            href="/heart-disease"
            title="Heart Disease"
            description="Assess cardiovascular health using blood pressure, cholesterol, and ECG data."
            icon={<Activity className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />}
            colorClass="group-hover:border-rose-500/50"
            bgClass="group-hover:bg-rose-500/5"
          />

          <DiseaseCard
            href="/parkinsons"
            title="Parkinson's"
            description="Detect early signs of Parkinson's disease through vocal pattern analysis."
            icon={<Brain className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" />}
            colorClass="group-hover:border-violet-500/50"
            bgClass="group-hover:bg-violet-500/5"
          />
        </motion.div>

        {/* Mobile: Swipeable Horizontal Cards */}
        <div className="md:hidden">
          <div
            {...cardsScroll}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scroll"
          >
            <div className="snap-start shrink-0 w-[85vw] sm:w-[70vw] max-w-[340px]">
              <DiseaseCard
                href="/diabetes"
                title="Diabetes"
                description="Analyze glucose levels, BMI, and other biomarkers to predict diabetes risk."
                icon={<Droplets className="w-7 h-7 text-blue-500" />}
                colorClass="group-hover:border-blue-500/50"
                bgClass="group-hover:bg-blue-500/5"
              />
            </div>
            <div className="snap-start shrink-0 w-[85vw] sm:w-[70vw] max-w-[340px]">
              <DiseaseCard
                href="/heart-disease"
                title="Heart Disease"
                description="Assess cardiovascular health using blood pressure, cholesterol, and ECG data."
                icon={<Activity className="w-7 h-7 text-rose-500" />}
                colorClass="group-hover:border-rose-500/50"
                bgClass="group-hover:bg-rose-500/5"
              />
            </div>
            <div className="snap-start shrink-0 w-[85vw] sm:w-[70vw] max-w-[340px]">
              <DiseaseCard
                href="/parkinsons"
                title="Parkinson's"
                description="Detect early signs of Parkinson's disease through vocal pattern analysis."
                icon={<Brain className="w-7 h-7 text-violet-500" />}
                colorClass="group-hover:border-violet-500/50"
                bgClass="group-hover:bg-violet-500/5"
              />
            </div>
          </div>
          {/* Swipe hint */}
          <p className="text-center text-xs text-neutral-400 mt-1 mb-2">← Swipe to explore →</p>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 sm:mt-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-5 sm:pt-6 px-2"
        >
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Disclaimer: This is an AI-assisted tool for educational purposes only. Always consult a doctor for medical diagnosis.
          </p>
        </motion.div>
      </div>
    </main>
  );
}