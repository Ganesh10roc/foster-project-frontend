import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScreenHeader({ title, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  return (
    <div className="px-6 pt-3 pb-1">
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="w-9 h-9 -ml-2 flex items-center justify-center rounded-full text-brand-500 active:bg-brand-50 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 16L6.5 10l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <p className="mt-3 text-[13px] tracking-wide text-ink-400 font-medium">
        {title}
      </p>
    </div>
  );
}
