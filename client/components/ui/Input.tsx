"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 ${className}`}
        {...props}
      />
    </div>
  );
};