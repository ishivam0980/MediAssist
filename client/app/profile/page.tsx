"use client";

import { useSession, signOut } from "next-auth/react";
import { User, Mail, LogOut, Shield, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    age: "",
    gender: "",
    bloodType: "",
    height: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (status === "authenticated") {
          const res = await axios.get("/api/user/profile");
          setFormData({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            image: res.data.user.image || "",
            phone: res.data.user.phone || "",
            age: res.data.user.age || "",
            gender: res.data.user.gender || "",
            bloodType: res.data.user.bloodType || "",
            height: res.data.user.height || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchProfile();
    }
  }, [status]);

  const handleSave = async () => {
    try {
      await axios.put("/api/user/profile", formData);
      await update(); // Refresh session data from DB
      setIsEditing(false);
      // Ideally show a success toast here
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Access Denied
        </h1>
        <p className="text-neutral-500 mb-8">Please sign in to view your profile.</p>
        <Link
          href="/login"
          className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 pt-24 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              My Profile
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Manage your personal information and account settings
            </p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm"
          >
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-end gap-6 -mt-12 mb-6">
                <div className="relative group">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-md object-cover bg-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-white text-xs font-medium">Change URL</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pb-2 w-full">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                        placeholder="Your Name"
                      />
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="text-sm text-neutral-500 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                        placeholder="Profile Image URL"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {formData.name}
                      </h2>
                      <p className="text-neutral-500">{formData.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Contact Information
                  </h3>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                    <div className="text-xs text-neutral-500 mb-1">Email Address</div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      {formData.email}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                    <div className="text-xs text-neutral-500 mb-1">Phone Number</div>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="font-medium text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                        placeholder="+1 234 567 890"
                      />
                    ) : (
                      <div className={`font-medium ${formData.phone ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 italic"}`}>
                        {formData.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">Age</div>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="font-medium text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                          placeholder="25"
                        />
                      ) : (
                        <div className={`font-medium ${formData.age ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 italic"}`}>
                          {formData.age || "--"}
                        </div>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">Gender</div>
                      {isEditing ? (
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full p-2 rounded-md"
                        >
                          <option value="" className="bg-white dark:bg-neutral-900">Select</option>
                          <option value="Male" className="bg-white dark:bg-neutral-900">Male</option>
                          <option value="Female" className="bg-white dark:bg-neutral-900">Female</option>
                          <option value="Other" className="bg-white dark:bg-neutral-900">Other</option>
                        </select>
                      ) : (
                        <div className={`font-medium ${formData.gender ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 italic"}`}>
                          {formData.gender || "--"}
                        </div>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">Blood Type</div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.bloodType}
                          onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                          className="font-medium text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                          placeholder="O+"
                        />
                      ) : (
                        <div className={`font-medium ${formData.bloodType ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 italic"}`}>
                          {formData.bloodType || "--"}
                        </div>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">Height</div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="font-medium text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 outline-none w-full"
                          placeholder="5'10"
                        />
                      ) : (
                        <div className={`font-medium ${formData.height ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 italic"}`}>
                          {formData.height || "--"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Account Actions
              </h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-xl font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                
                {!isEditing && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                  Account Status
                </h3>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                Your account is active and fully verified. You have access to all prediction models.
              </p>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Personal Account
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
