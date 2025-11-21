"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface DiseaseCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  colorClass: string; // e.g. "group-hover:border-blue-500/50"
  bgClass: string;    // e.g. "group-hover:bg-blue-500/5"
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export function DiseaseCard({ href, title, description, icon, colorClass, bgClass }: DiseaseCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={href} className="block h-full group">
        <div
          className={`relative h-full p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${colorClass} ${bgClass} hover:shadow-xl hover:-translate-y-1`}
        >
          <div className="mb-4 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 w-fit group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:gap-3 transition-all">
            Start Assessment <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}