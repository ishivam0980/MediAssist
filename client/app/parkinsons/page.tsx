"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Loader2 } from "lucide-react";
import Link from "next/link";
import { PredictionResult } from "@/components/ui/PredictionResult";
import { predictParkinsons } from "@/lib/api";

export default function ParkinsonsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "1",
    Ethnicity: "0",
    EducationLevel: "0",
    BMI: "",
    Smoking: "0",
    AlcoholConsumption: "",
    PhysicalActivity: "",
    DietQuality: "",
    SleepQuality: "",
    FamilyHistoryParkinsons: "0",
    TraumaticBrainInjury: "0",
    Hypertension: "0",
    Diabetes: "0",
    Depression: "0",
    Stroke: "0",
    SystolicBP: "",
    DiastolicBP: "",
    CholesterolTotal: "",
    CholesterolLDL: "",
    CholesterolHDL: "",
    CholesterolTriglycerides: "",
    UPDRS: "",
    MoCA: "",
    FunctionalAssessment: "",
    Tremor: "0",
    Rigidity: "0",
    Bradykinesia: "0",
    PosturalInstability: "0",
    SpeechProblems: "0",
    SleepDisorders: "0",
    Constipation: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await predictParkinsons(formData);
      
      if (response.success) {
        setResult(response);

        // Save to LocalStorage if Guest
        if (!session) {
          const historyItem = {
            id: Date.now().toString(),
            disease: "parkinsons",
            createdAt: new Date().toISOString(),
            result: {
              risk_level: response.risk_assessment?.level,
              probability: response.prediction?.probability,
              prediction: response.prediction?.disease_detected ? "Positive" : "Negative",
            },
            inputData: formData,
          };
          
          const existingHistory = JSON.parse(localStorage.getItem("mediassist_history") || "[]");
          localStorage.setItem("mediassist_history", JSON.stringify([...existingHistory, historyItem]));
        }
      } else {
        setError(response.error || "An error occurred during analysis.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setFormData({
      Age: "",
      Gender: "1",
      Ethnicity: "0",
      EducationLevel: "0",
      BMI: "",
      Smoking: "0",
      AlcoholConsumption: "",
      PhysicalActivity: "",
      DietQuality: "",
      SleepQuality: "",
      FamilyHistoryParkinsons: "0",
      TraumaticBrainInjury: "0",
      Hypertension: "0",
      Diabetes: "0",
      Depression: "0",
      Stroke: "0",
      SystolicBP: "",
      DiastolicBP: "",
      CholesterolTotal: "",
      CholesterolLDL: "",
      CholesterolHDL: "",
      CholesterolTriglycerides: "",
      UPDRS: "",
      MoCA: "",
      FunctionalAssessment: "",
      Tremor: "0",
      Rigidity: "0",
      Bradykinesia: "0",
      PosturalInstability: "0",
      SpeechProblems: "0",
      SleepDisorders: "0",
      Constipation: "0",
    });
  };

  if (result) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center">
        <PredictionResult result={result} onReset={resetForm} />
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="w-full max-w-[90rem] mx-auto flex-1 flex flex-col min-h-0">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                <Brain className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Parkinson's Assessment
              </h1>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl">
              This comprehensive assessment evaluates multiple factors including demographics, lifestyle, medical history, and clinical symptoms.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400" role="alert">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            
            <div className="space-y-8">
              {/* Group 1: Demographics */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Demographics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Age [Age] (Years)</label>
                    <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} required placeholder="e.g. 65" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender [Gender]</label>
                    <select name="Gender" value={formData.Gender} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ethnicity [Ethnicity]</label>
                    <select name="Ethnicity" value={formData.Ethnicity} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">Caucasian</option>
                      <option value="1">African American</option>
                      <option value="2">Asian</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Education Level [EducationLevel]</label>
                    <select name="EducationLevel" value={formData.EducationLevel} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">None</option>
                      <option value="1">High School</option>
                      <option value="2">Bachelor's</option>
                      <option value="3">Higher</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Body Mass Index [BMI] (kg/m²)</label>
                    <input type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleInputChange} required placeholder="e.g. 24.5" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Group 2: Lifestyle */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Smoking Status [Smoking]</label>
                    <select name="Smoking" value={formData.Smoking} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Alcohol Consumption [AlcoholConsumption] (Units/Week)</label>
                    <input type="number" name="AlcoholConsumption" value={formData.AlcoholConsumption} onChange={handleInputChange} required placeholder="e.g. 2" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Physical Activity [PhysicalActivity] (Hours/Week)</label>
                    <input type="number" name="PhysicalActivity" value={formData.PhysicalActivity} onChange={handleInputChange} required placeholder="e.g. 5" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Diet Quality [DietQuality] (0-10)</label>
                    <input type="number" name="DietQuality" value={formData.DietQuality} onChange={handleInputChange} required placeholder="e.g. 8" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sleep Quality [SleepQuality] (0-10)</label>
                    <input type="number" name="SleepQuality" value={formData.SleepQuality} onChange={handleInputChange} required placeholder="e.g. 7" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Group 3: History */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Medical History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Family History of Parkinson's [FamilyHistoryParkinsons]</label>
                    <select name="FamilyHistoryParkinsons" value={formData.FamilyHistoryParkinsons} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Traumatic Brain Injury [TraumaticBrainInjury]</label>
                    <select name="TraumaticBrainInjury" value={formData.TraumaticBrainInjury} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Hypertension [Hypertension]</label>
                    <select name="Hypertension" value={formData.Hypertension} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Diabetes History [Diabetes]</label>
                    <select name="Diabetes" value={formData.Diabetes} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Depression [Depression]</label>
                    <select name="Depression" value={formData.Depression} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Stroke History [Stroke]</label>
                    <select name="Stroke" value={formData.Stroke} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Group 4: Vitals */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Vitals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Systolic Blood Pressure [SystolicBP] (mmHg)</label>
                    <input type="number" name="SystolicBP" value={formData.SystolicBP} onChange={handleInputChange} required placeholder="e.g. 120" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Diastolic Blood Pressure [DiastolicBP] (mmHg)</label>
                    <input type="number" name="DiastolicBP" value={formData.DiastolicBP} onChange={handleInputChange} required placeholder="e.g. 80" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Group 5: Labs */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Labs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Total Cholesterol [CholesterolTotal] (mg/dL)</label>
                    <input type="number" name="CholesterolTotal" value={formData.CholesterolTotal} onChange={handleInputChange} required placeholder="e.g. 200" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">LDL Cholesterol [CholesterolLDL] (mg/dL)</label>
                    <input type="number" name="CholesterolLDL" value={formData.CholesterolLDL} onChange={handleInputChange} required placeholder="e.g. 100" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">HDL Cholesterol [CholesterolHDL] (mg/dL)</label>
                    <input type="number" name="CholesterolHDL" value={formData.CholesterolHDL} onChange={handleInputChange} required placeholder="e.g. 60" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Triglycerides [CholesterolTriglycerides] (mg/dL)</label>
                    <input type="number" name="CholesterolTriglycerides" value={formData.CholesterolTriglycerides} onChange={handleInputChange} required placeholder="e.g. 150" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Group 6: Assessments */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Clinical Assessments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">UPDRS Score [UPDRS]</label>
                    <input type="number" name="UPDRS" value={formData.UPDRS} onChange={handleInputChange} required placeholder="e.g. 15" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">MoCA Score [MoCA] (0-30)</label>
                    <input type="number" name="MoCA" value={formData.MoCA} onChange={handleInputChange} required placeholder="e.g. 26" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Functional Assessment [FunctionalAssessment] (0-10)</label>
                    <input type="number" name="FunctionalAssessment" value={formData.FunctionalAssessment} onChange={handleInputChange} required placeholder="e.g. 8" className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Group 7: Symptoms */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  Symptoms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tremor [Tremor]</label>
                    <select name="Tremor" value={formData.Tremor} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Rigidity [Rigidity]</label>
                    <select name="Rigidity" value={formData.Rigidity} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Bradykinesia [Bradykinesia]</label>
                    <select name="Bradykinesia" value={formData.Bradykinesia} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Postural Instability [PosturalInstability]</label>
                    <select name="PosturalInstability" value={formData.PosturalInstability} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Speech Problems [SpeechProblems]</label>
                    <select name="SpeechProblems" value={formData.SpeechProblems} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sleep Disorders [SleepDisorders]</label>
                    <select name="SleepDisorders" value={formData.SleepDisorders} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Constipation [Constipation]</label>
                    <select name="Constipation" value={formData.Constipation} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Analyze Parkinson's Risk"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
