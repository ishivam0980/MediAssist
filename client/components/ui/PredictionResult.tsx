"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";

interface FeatureImportance {
  feature: string;
  impact: number;
  raw_value: number;
  direction: string;
}

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
    feature_importance?: FeatureImportance[];
  } | null;
  onReset: () => void;
}

// Human-readable feature name mapping
const FEATURE_LABELS: Record<string, string> = {
  // Diabetes
  AGE: "Age",
  Gender: "Gender",
  Urea: "Blood Urea",
  Cr: "Creatinine",
  HbA1c: "HbA1c (Glycated Hemoglobin)",
  Chol: "Cholesterol",
  TG: "Triglycerides",
  HDL: "HDL Cholesterol",
  LDL: "LDL Cholesterol",
  VLDL: "VLDL Cholesterol",
  BMI: "Body Mass Index",
  // Heart Disease
  age: "Age",
  sex: "Sex",
  cp: "Chest Pain Type",
  trestbps: "Resting Blood Pressure",
  chol: "Serum Cholesterol",
  fbs: "Fasting Blood Sugar",
  restecg: "Resting ECG",
  thalach: "Max Heart Rate",
  exang: "Exercise Angina",
  oldpeak: "ST Depression",
  slope: "ST Slope",
  ca: "Major Vessels",
  thal: "Thalassemia",
  // Parkinson's
  Age: "Age",
  Ethnicity: "Ethnicity",
  EducationLevel: "Education Level",
  Smoking: "Smoking",
  AlcoholConsumption: "Alcohol Consumption",
  PhysicalActivity: "Physical Activity",
  DietQuality: "Diet Quality",
  SleepQuality: "Sleep Quality",
  FamilyHistoryParkinsons: "Family History",
  TraumaticBrainInjury: "Brain Injury History",
  Hypertension: "Hypertension",
  Diabetes: "Diabetes",
  Depression: "Depression",
  Stroke: "Stroke History",
  SystolicBP: "Systolic BP",
  DiastolicBP: "Diastolic BP",
  CholesterolTotal: "Total Cholesterol",
  CholesterolLDL: "LDL Cholesterol",
  CholesterolHDL: "HDL Cholesterol",
  CholesterolTriglycerides: "Triglycerides",
  UPDRS: "UPDRS Score",
  MoCA: "MoCA Score",
  FunctionalAssessment: "Functional Assessment",
  Tremor: "Tremor",
  Rigidity: "Rigidity",
  Bradykinesia: "Bradykinesia",
  PosturalInstability: "Postural Instability",
  SpeechProblems: "Speech Problems",
  SleepDisorders: "Sleep Disorders",
  Constipation: "Constipation",
};

export function PredictionResult({ result, onReset }: PredictionResultProps) {
  if (!result) return null;

  const { prediction, risk_assessment, feature_importance } = result;
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

        {/* Feature Importance Section */}
        {feature_importance && feature_importance.length > 0 && (
          <div className="w-full mt-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 text-left">
              Top Contributing Factors
            </h4>
            <div className="space-y-3">
              {feature_importance.map((item, index) => (
                <motion.div
                  key={item.feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.direction === "increases risk" ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                      {item.direction === "increases risk" ? (
                        <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {FEATURE_LABELS[item.feature] || item.feature}
                      </p>
                      <p className={`text-xs ${item.direction === "increases risk" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                        {item.direction}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      #{index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
