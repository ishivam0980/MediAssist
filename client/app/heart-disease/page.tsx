"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { PredictionResult } from "@/components/ui/PredictionResult";
import { predictHeartDisease } from "@/lib/api";

export default function HeartDiseasePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: "",
    sex: "1",
    cp: "0",
    trestbps: "",
    chol: "",
    fbs: "0",
    restecg: "0",
    thalach: "",
    exang: "0",
    oldpeak: "",
    slope: "1",
    ca: "0",
    thal: "2",
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
      const response = await predictHeartDisease(formData);
      
      if (response.success) {
        setResult(response);

        // Save to LocalStorage if Guest
        if (!session) {
          const historyItem = {
            id: Date.now().toString(),
            disease: "heart-disease",
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
      age: "",
      sex: "1",
      cp: "0",
      trestbps: "",
      chol: "",
      fbs: "0",
      restecg: "0",
      thalach: "",
      exang: "0",
      oldpeak: "",
      slope: "1",
      ca: "0",
      thal: "2",
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
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <Heart className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Heart Disease Assessment
              </h1>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Complete the form below with your cardiovascular metrics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400" role="alert">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  required
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                  placeholder="e.g. 55"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Chest Pain Type [cp]</label>
                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">Typical Angina</option>
                  <option value="1">Atypical Angina</option>
                  <option value="2">Non-anginal Pain</option>
                  <option value="3">Asymptomatic</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Resting Blood Pressure [trestbps] (mm Hg)</label>
                <input
                  type="number"
                  name="trestbps"
                  required
                  value={formData.trestbps}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                  placeholder="e.g. 120"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Serum Cholestoral [chol] (mg/dl)</label>
                <input
                  type="number"
                  name="chol"
                  required
                  value={formData.chol}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                  placeholder="e.g. 200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Fasting Blood Sugar &gt; 120 mg/dl [fbs]</label>
                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">False</option>
                  <option value="1">True</option>
                </select>
              </div>

               <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Resting Electrocardiographic Results [restecg]</label>
                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">Normal</option>
                  <option value="1">Abnormal</option>
                  <option value="2">Hypertrophy</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Maximum Heart Rate Achieved [thalach]</label>
                <input
                  type="number"
                  name="thalach"
                  required
                  value={formData.thalach}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                  placeholder="e.g. 150"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Exercise Induced Angina [exang]</label>
                <select
                  name="exang"
                  value={formData.exang}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">ST Depression Induced by Exercise [oldpeak]</label>
                <input
                  type="number"
                  name="oldpeak"
                  required
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                  placeholder="e.g. 1.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Slope of the Peak Exercise ST Segment [slope]</label>
                <select
                  name="slope"
                  value={formData.slope}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">Up</option>
                  <option value="1">Flat</option>
                  <option value="2">Down</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Number of Major Vessels [ca]</label>
                <select
                  name="ca"
                  value={formData.ca}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Thalassemia [thal]</label>
                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                >
                  <option value="1">Normal</option>
                  <option value="2">Fixed Defect</option>
                  <option value="3">Reversable Defect</option>
                </select>
              </div>

            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Analyze Heart Health"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
