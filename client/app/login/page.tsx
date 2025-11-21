"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

type Variant = "LOGIN" | "REGISTER";
type RegisterStep = "DETAILS" | "OTP";

export default function LoginPage() {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [step, setStep] = useState<RegisterStep>("DETAILS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const toggleVariant = () => {
    setVariant(variant === "LOGIN" ? "REGISTER" : "LOGIN");
    setStep("DETAILS");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (callback?.error) {
        setError(callback.error);
      } else {
        router.push("/"); 
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register (Step 1: Send OTP)
  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(data.password)) {
        throw new Error("Password must be 8+ chars with 1 letter & 1 number.");
      }

      await axios.post("/api/auth/send-otp", {
        email: data.email,
        type: "register",
      });
      setStep("OTP");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Register (Step 2: Verify OTP & Create Account)
  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        otp: data.otp,
      });

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {variant === "LOGIN" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {variant === "LOGIN"
                ? "Enter your credentials to access your history"
                : step === "DETAILS"
                ? "Sign up to save your health assessments"
                : "We sent a verification code to your email"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {variant === "LOGIN" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-3"
              >
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="py-2"
                />
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Sign In"}
                </button>
              </motion.form>
            ) : step === "DETAILS" ? (
              <motion.form
                key="register-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegisterStep1}
                className="space-y-3"
              >
                <Input
                  label="Full Name"
                  id="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="py-2"
                />
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="py-2"
                />
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 8 chars (1 letter, 1 number)"
                  className="py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Send Verification Code"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegisterStep2}
                className="space-y-3"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-2">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-neutral-500">Sent to {data.email}</p>
                </div>
                <Input
                  label="Enter 6-digit Code"
                  id="otp"
                  value={data.otp}
                  onChange={handleChange}
                  required
                  placeholder="123456"
                  className="text-center text-xl tracking-widest py-2"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("DETAILS")}
                  className="w-full text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Change Email
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-3 text-neutral-700 dark:text-neutral-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <div className="mt-6 text-center space-y-3">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {variant === "LOGIN" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={toggleVariant}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={toggleVariant}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              Continue as Guest <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}