"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "reset" | "cancel";
}

export const ActionButton: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  variant = "primary",
  className,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition";

  const variants: Record<string, string> = {
    primary:
      "text-white bg-blue-600 hover:bg-blue-700 border border-transparent",
    secondary:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
    danger:
      "text-white bg-red-600 hover:bg-red-700 border border-transparent",
    reset:
      "text-gray-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300",
    cancel:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      className={clsx(baseClasses, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? "Processing..." : children}
    </button>
  );
};

interface ActionButtonsProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right" | "between";
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  children,
  align = "right",
  className,
}) => {
  const alignmentClasses: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={clsx(
        "flex gap-4 ",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};
