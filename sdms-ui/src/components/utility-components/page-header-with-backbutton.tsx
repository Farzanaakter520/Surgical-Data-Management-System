"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const PageHeader = ({ title, subtitle, onBack }: PageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all"
        aria-label="Go back"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>

      {/* Title + Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};
