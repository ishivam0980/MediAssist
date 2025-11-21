"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Droplets, Sparkles } from "lucide-react";
import { DiseaseCard } from "@/components/ui/DiseaseCard"; // Import from components

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function Home() {
  return (
    <main className="w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="min-h-full flex flex-col justify-center relative z-10 max-w-6xl mx-auto px-6 w-full py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Powered by Advanced Machine Learning
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Medi<span className="text-emerald-600 dark:text-emerald-500">Assist</span>
          </h1>
          
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Early detection saves lives. Use our AI-powered tools to assess your risk for Diabetes, Heart Disease, and Parkinson's in seconds.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <DiseaseCard
            href="/diabetes"
            title="Diabetes"
            description="Analyze glucose levels, BMI, and other biomarkers to predict diabetes risk."
            icon={<Droplets className="w-8 h-8 text-blue-500" />}
            colorClass="group-hover:border-blue-500/50"
            bgClass="group-hover:bg-blue-500/5"
          />

          <DiseaseCard
            href="/heart-disease"
            title="Heart Disease"
            description="Assess cardiovascular health using blood pressure, cholesterol, and ECG data."
            icon={<Activity className="w-8 h-8 text-rose-500" />}
            colorClass="group-hover:border-rose-500/50"
            bgClass="group-hover:bg-rose-500/5"
          />

          <DiseaseCard
            href="/parkinsons"
            title="Parkinson's"
            description="Detect early signs of Parkinson's disease through vocal pattern analysis."
            icon={<Brain className="w-8 h-8 text-violet-500" />}
            colorClass="group-hover:border-violet-500/50"
            bgClass="group-hover:bg-violet-500/5"
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-6"
        >
          <p className="text-sm text-neutral-500">
            Disclaimer: This is an AI-assisted tool for educational purposes only. Always consult a doctor for medical diagnosis.
          </p>
        </motion.div>
      </div>
    </main>
  );
}