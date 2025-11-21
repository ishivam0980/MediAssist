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
    // Demographics
    Age: "",
    Gender: "1",
    Ethnicity: "0",
    EducationLevel: "0",
    BMI: "",
    
    // Lifestyle
    Smoking: "0",
    AlcoholConsumption: "",
    PhysicalActivity: "",
    DietQuality: "",
    SleepQuality: "",
    
    // History
    FamilyHistoryParkinsons: "0",
    TraumaticBrainInjury: "0",
    
    // Medical Conditions
    Hypertension: "0",
    Diabetes: "0",
    Depression: "0",
    Stroke: "0",
    
    // Vitals
    SystolicBP: "",
    DiastolicBP: "",
    
    // Labs
    CholesterolTotal: "",
    CholesterolLDL: "",
    CholesterolHDL: "",
    CholesterolTriglycerides: "",
    
    // Assessments
    UPDRS: "",
    MoCA: "",
    FunctionalAssessment: "",
    
    // Symptoms
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
      // Demographics
      Age: "",
      Gender: "1",
      Ethnicity: "0",
      EducationLevel: "0",
      BMI: "",
      
      // Lifestyle
      Smoking: "0",
      AlcoholConsumption: "",
      PhysicalActivity: "",
      DietQuality: "",
      SleepQuality: "",
      
      // History
      FamilyHistoryParkinsons: "0",
      TraumaticBrainInjury: "0",
      
      // Medical Conditions
      Hypertension: "0",
      Diabetes: "0",
      Depression: "0",
      Stroke: "0",
      
      // Vitals
      SystolicBP: "",
      DiastolicBP: "",
      
      // Labs
      CholesterolTotal: "",
      CholesterolLDL: "",
      CholesterolHDL: "",
      CholesterolTriglycerides: "",
      
      // Assessments
      UPDRS: "",
      MoCA: "",
      FunctionalAssessment: "",
      
      // Symptoms
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Column 1: Demographics & Lifestyle */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Demographics
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Age</label>
                      <input type="number" name="Age" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                      <select name="Gender" className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange}>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">BMI</label>
                      <input type="number" name="BMI" step="0.1" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Ethnicity</label>
                      <select name="Ethnicity" className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange}>
                        <option value="0">Cauc.</option>
                        <option value="1">Afr. Am.</option>
                        <option value="2">Asian</option>
                        <option value="3">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Education</label>
                      <select name="EducationLevel" className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange}>
                        <option value="0">None</option>
                        <option value="1">High School</option>
                        <option value="2">Bachelor's</option>
                        <option value="3">Higher</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Lifestyle
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Alcohol</label>
                      <input type="number" name="AlcoholConsumption" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} placeholder="Units/Wk" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Activity</label>
                      <input type="number" name="PhysicalActivity" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} placeholder="Hrs/Wk" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Diet (0-10)</label>
                      <input type="number" name="DietQuality" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Sleep (0-10)</label>
                      <input type="number" name="SleepQuality" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                  </div>
                </section>
              </div>

              {/* Column 2: Medical History */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Medical History
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "Smoking", label: "Smoker" },
                      { name: "FamilyHistoryParkinsons", label: "Family History" },
                      { name: "TraumaticBrainInjury", label: "Brain Injury" },
                      { name: "Hypertension", label: "Hypertension" },
                      { name: "Diabetes", label: "Diabetes" },
                      { name: "Depression", label: "Depression" },
                      { name: "Stroke", label: "Stroke" },
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <input type="checkbox" name={item.name} onChange={(e) => setFormData(prev => ({ ...prev, [item.name]: e.target.checked ? "1" : "0" }))} className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" />
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>

              {/* Column 3: Vitals & Labs */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Vitals & Labs
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Sys BP</label>
                        <input type="number" name="SystolicBP" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Dia BP</label>
                        <input type="number" name="DiastolicBP" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Total Chol.</label>
                      <input type="number" name="CholesterolTotal" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">LDL</label>
                      <input type="number" name="CholesterolLDL" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">HDL</label>
                      <input type="number" name="CholesterolHDL" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Triglycerides</label>
                      <input type="number" name="CholesterolTriglycerides" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                  </div>
                </section>
              </div>

              {/* Column 4: Assessments & Symptoms */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Assessments
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">UPDRS</label>
                      <input type="number" name="UPDRS" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} placeholder="0-199" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">MoCA</label>
                      <input type="number" name="MoCA" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} placeholder="0-30" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Functional (0-10)</label>
                      <input type="number" name="FunctionalAssessment" required className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" onChange={handleInputChange} />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    Symptoms
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "Tremor", label: "Tremor" },
                      { name: "Rigidity", label: "Rigidity" },
                      { name: "Bradykinesia", label: "Bradykinesia" },
                      { name: "PosturalInstability", label: "Postural Instability" },
                      { name: "SpeechProblems", label: "Speech Problems" },
                      { name: "SleepDisorders", label: "Sleep Disorders" },
                      { name: "Constipation", label: "Constipation" },
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <input type="checkbox" name={item.name} onChange={(e) => setFormData(prev => ({ ...prev, [item.name]: e.target.checked ? "1" : "0" }))} className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" />
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
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
