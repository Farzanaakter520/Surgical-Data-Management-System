"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "900px",
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create container only on client
    const el = document.createElement("div");
    el.className =
      "portal-container fixed inset-0 z-50 flex justify-center items-start bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60 transition-opacity";
    el.style.overflow = "auto";
    el.style.padding = "2rem 0";
    setContainer(el);
  }, []);

  useEffect(() => {
    if (!container || !isOpen) return;

    document.body.style.overflow = "hidden";
    document.body.appendChild(container);

    return () => {
      document.body.style.overflow = "auto";
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [isOpen, container]);

  if (!isOpen || !container) return null;

  return createPortal(
    <div className="flex justify-center w-full px-4 sm:px-6 md:px-0">
      <div
        className="portal-content bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl w-full sm:w-[85%] transition-colors"
        style={{ maxWidth }}
      >
        <div className="flex justify-between items-center mb-4 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-1">{children}</div>
      </div>
    </div>,
    container
  );
};

export default PortalModal;
