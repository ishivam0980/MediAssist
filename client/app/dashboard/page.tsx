"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, Activity, Trash2, Clock } from "lucide-react";
import Link from "next/link";
import { HistoryChart } from "@/components/HistoryChart";

interface HistoryItem {
  _id?: string;
  id?: string;
  disease: string;
  result: {
    risk_level: string;
    probability: number;
    prediction: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      if (status === "authenticated") {
        await axios.delete(`/api/user/history/${id}`);
      } else {
        const localData = JSON.parse(localStorage.getItem("mediassist_history") || "[]");
        const newData = localData.filter((item: any) => item.id !== id);
        localStorage.setItem("mediassist_history", JSON.stringify(newData));
      }
      setHistory((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (status === "authenticated") {
          // Fetch from MongoDB (We will create this route next)
          const res = await axios.get("/api/user/history");
          setHistory(res.data.history);
        } else {
          // Fetch from LocalStorage (Guest)
          const localData = localStorage.getItem("mediassist_history");
          if (localData) {
            setHistory(JSON.parse(localData).reverse());
          }
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchHistory();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Health Assessment History
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              {status === "authenticated"
                ? `Welcome back, ${session?.user?.name}`
                : "Viewing Guest History (Login to save permanently)"}
            </p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            Back to Home
          </Link>
        </header>

        {/* Stats Overview */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="text-xs text-neutral-500 mb-1">Total Assessments</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{history.length}</div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="text-xs text-neutral-500 mb-1">High Risk Results</div>
              <div className="text-2xl font-bold text-red-600">
                {history.filter(h => h.result.risk_level === "High").length}
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="text-xs text-neutral-500 mb-1">Latest Assessment</div>
              <div className="text-base font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {history[0]?.disease.replace("-", " ")}
              </div>
              <div className="text-xs text-neutral-400">
                {new Date(history[0]?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {history.length > 1 && (
          <div className="mb-8">
            <HistoryChart data={history} />
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
            <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              No assessments yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Start a new assessment to see your results here.
            </p>
            <Link
              href="/"
              className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
            >
              Start Assessment
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item, index) => (
              <motion.div
                key={item._id || item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      item.result.risk_level === "High"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                        : item.result.risk_level === "Moderate"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                    }`}
                  >
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                      {item.disease.replace("-", " ")} Assessment
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-neutral-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">Risk Level</div>
                    <div
                      className={`font-bold ${
                        item.result.risk_level === "High"
                          ? "text-red-600"
                          : item.result.risk_level === "Moderate"
                          ? "text-yellow-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.result.risk_level}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-neutral-500">Confidence</div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {(item.result.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item._id || item.id!)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}