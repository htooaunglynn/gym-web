"use client";

import React, { useEffect, useRef } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Width class — default is max-w-lg */
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={[
          "relative z-10 w-full bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]",
          maxWidth,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900 tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p
                id="modal-description"
                className="text-sm text-gray-500 mt-0.5"
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
