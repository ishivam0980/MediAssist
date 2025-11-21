"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface PredictionResultProps {
  result: {
    prediction: {
      has_disease: number;
      disease_detected: boolean;
      confidence: number;
      probability: number;
    };
    risk_assessment: {
      level: string;
      color: string;
      message: string;
    };
  } | null;
  onReset: () => void;
}

export function PredictionResult({ result, onReset }: PredictionResultProps) {
  if (!result) return null;

  const { prediction, risk_assessment } = result;
  const isHighRisk = risk_assessment.level === "High";
  const isModerateRisk = risk_assessment.level === "Moderate";
  
  // Determine color scheme based on risk
  const getColor = () => {
    if (isHighRisk) return "text-red-500 bg-red-500";
    if (isModerateRisk) return "text-orange-500 bg-orange-500";
    return "text-emerald-500 bg-emerald-500";
  };

  const colorClass = getColor();
  const borderColor = isHighRisk ? "border-red-200 dark:border-red-900" : 
                      isModerateRisk ? "border-orange-200 dark:border-orange-900" : 
                      "border-emerald-200 dark:border-emerald-900";
  
  const bgColor = isHighRisk ? "bg-red-50 dark:bg-red-950/30" : 
                  isModerateRisk ? "bg-orange-50 dark:bg-orange-950/30" : 
                  "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full max-w-2xl mx-auto mt-8 p-8 rounded-3xl border ${borderColor} ${bgColor} shadow-lg`}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Icon */}
        <div className={`p-4 rounded-full ${colorClass.split(" ")[1]}/10`}>
          {isHighRisk ? (
            <AlertTriangle className={`w-12 h-12 ${colorClass.split(" ")[0]}`} />
          ) : isModerateRisk ? (
            <Info className={`w-12 h-12 ${colorClass.split(" ")[0]}`} />
          ) : (
            <CheckCircle className={`w-12 h-12 ${colorClass.split(" ")[0]}`} />
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {risk_assessment.level} Risk Detected
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Confidence: {prediction.confidence}%
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${colorClass.split(" ")[1]}`}
          />
        </div>

        {/* Message */}
        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-lg">
          {risk_assessment.message}
        </p>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
        >
          Start New Assessment
        </button>
      </div>
    </motion.div>
  );
}
