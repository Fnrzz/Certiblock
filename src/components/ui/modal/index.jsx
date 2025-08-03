"use client";
import React, { useRef, useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose, // prop onClose masih dibutuhkan untuk menutup via Escape key
  children,
  className,
  isFullscreen = false,
}) => {
  const modalRef = useRef(null);

  // Efek untuk menutup modal dengan menekan tombol Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Efek untuk mengunci scroll body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white dark:bg-gray-900";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      {/* Backdrop (latar belakang) tanpa onClick */}
      {!isFullscreen && (
        <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses}  ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol close (X) telah dihapus */}
        <div>{children}</div>
      </div>
    </div>
  );
};
