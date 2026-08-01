import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-slate-700 to-slate-600">
        <div className="absolute top-3 right-3 w-16 h-8 bg-slate-600 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>

        {/* Info skeleton */}
        <div className="flex gap-2">
          <div className="h-8 bg-slate-700 rounded-lg flex-1"></div>
          <div className="h-8 bg-slate-700 rounded-lg flex-1"></div>
        </div>

        {/* Cuisine skeleton */}
        <div className="h-3 bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  );
}
