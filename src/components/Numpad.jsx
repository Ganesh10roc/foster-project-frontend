import React from "react";

const KEYS = [
  ["1", ""], ["2", "ABC"], ["3", "DEF"],
  ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
  ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
];

export default function Numpad({ onPress, onBackspace }) {
  return (
    <div className="mt-auto bg-ink-50/70 px-5 pt-3 pb-6 shrink-0">
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {KEYS.map(([num, letters]) => (
          <button
            key={num}
            onClick={() => onPress(num)}
            className="h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center active:bg-brand-50 active:scale-[0.97] transition-all"
          >
            <span className="text-lg font-display font-semibold text-ink-900 leading-none">
              {num}
            </span>
            {letters && (
              <span className="text-[9px] tracking-widest text-ink-400 mt-0.5">
                {letters}
              </span>
            )}
          </button>
        ))}
        <div />
        <button
          onClick={() => onPress("0")}
          className="h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center active:bg-brand-50 active:scale-[0.97] transition-all"
        >
          <span className="text-lg font-display font-semibold text-ink-900">0</span>
        </button>
        <button
          onClick={onBackspace}
          className="h-14 rounded-2xl flex items-center justify-center active:bg-ink-100 active:scale-[0.97] transition-all"
          aria-label="Backspace"
        >
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <path
              d="M7.5 1h12a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5h-12L1 9l6.5-8z"
              stroke="#4A505C"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 6l5 6M15.5 6l-5 6"
              stroke="#4A505C"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
