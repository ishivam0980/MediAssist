"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogIn, User, LayoutDashboard, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          MediAssist
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        ) : status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Dashboard
            </Link>

            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              >
                Sign Out
            </button>

            <Link href="/profile" className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Profile">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 border border-neutral-200 dark:border-neutral-800">
                    <User className="w-5 h-5" />
                  </div>
                )}
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
