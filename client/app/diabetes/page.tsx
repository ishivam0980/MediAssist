"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Loader2 } from "lucide-react";
import Link from "next/link";
import { PredictionResult } from "@/components/ui/PredictionResult";
import { predictDiabetes } from "@/lib/api";

export default function DiabetesPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    AGE: "",
    Gender: "1", // Default Male
    Urea: "",
    Cr: "",
    HbA1c: "",
    Chol: "",
    TG: "",
    HDL: "",
    LDL: "",
    VLDL: "",
    BMI: "",
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
      const response = await predictDiabetes(formData);
      
      if (response.success) {
        setResult(response);

        // Save to LocalStorage if Guest
        if (!session) {
          const historyItem = {
            id: Date.now().toString(),
            disease: "diabetes",
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
      AGE: "",
      Gender: "1",
      Urea: "",
      Cr: "",
      HbA1c: "",
      Chol: "",
      TG: "",
      HDL: "",
      LDL: "",
      VLDL: "",
      BMI: "",
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
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Diabetes Assessment
              </h1>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Enter your clinical data below to get an AI-powered assessment of your diabetes risk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400" role="alert">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Personal Info */}
              <div className="md:col-span-3 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  Personal Information
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Age (years)</label>
                  <input
                    type="number"
                    name="AGE"
                    required
                    min="0"
                    max="120"
                    value={formData.AGE}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="e.g. 45"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  >
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">BMI</label>
                  <input
                    type="number"
                    name="BMI"
                    required
                    step="0.1"
                    value={formData.BMI}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="e.g. 24.5"
                  />
                </div>
              </div>

              {/* Clinical Data */}
              <div className="md:col-span-4 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  Clinical Data
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">HbA1c</label>
                    <input
                      type="number"
                      name="HbA1c"
                      required
                      step="0.1"
                      value={formData.HbA1c}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="e.g. 5.7"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Urea</label>
                    <input
                      type="number"
                      name="Urea"
                      required
                      step="0.1"
                      value={formData.Urea}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="mg/dL"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Creatinine (Cr)</label>
                    <input
                      type="number"
                      name="Cr"
                      required
                      step="0.1"
                      value={formData.Cr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="mg/dL"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Cholesterol</label>
                    <input
                      type="number"
                      name="Chol"
                      required
                      step="0.1"
                      value={formData.Chol}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="mg/dL"
                    />
                  </div>
                </div>
              </div>

              {/* Lipid Profile */}
              <div className="md:col-span-5 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  Lipid Profile
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">TG</label>
                    <input
                      type="number"
                      name="TG"
                      required
                      step="0.1"
                      value={formData.TG}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="Triglycerides"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">HDL</label>
                    <input
                      type="number"
                      name="HDL"
                      required
                      step="0.1"
                      value={formData.HDL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="High Density"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">LDL</label>
                    <input
                      type="number"
                      name="LDL"
                      required
                      step="0.1"
                      value={formData.LDL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="Low Density"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">VLDL</label>
                    <input
                      type="number"
                      name="VLDL"
                      required
                      step="0.1"
                      value={formData.VLDL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="Very Low Density"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Analyze Risk"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
