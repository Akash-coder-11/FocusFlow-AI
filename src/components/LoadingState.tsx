// ─────────────────────────────────────────────
//  Loading skeleton states
// ─────────────────────────────────────────────
import React from 'react';

const SkeletonLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton h-3 ${className}`} />
);

export const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
      {/* Summary card skeleton */}
      <div className="glass-card p-5 lg:col-span-2 xl:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton w-9 h-9 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <SkeletonLine className="w-32" />
            <SkeletonLine className="w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-5/6" />
          <SkeletonLine className="w-4/6" />
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonLine className="w-24" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="skeleton w-4 h-4 rounded" />
              <SkeletonLine className="flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="glass-card p-5">
        <div className="skeleton w-8 h-8 rounded-xl mb-4" />
        <SkeletonLine className="w-20 mb-2" />
        <SkeletonLine className="w-12 h-8 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex justify-between items-center">
              <SkeletonLine className="w-24" />
              <SkeletonLine className="w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Tasks skeleton */}
      <div className="glass-card p-5">
        <div className="skeleton w-8 h-8 rounded-xl mb-4" />
        <SkeletonLine className="w-24 mb-4" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start gap-3 mb-3">
            <div className="skeleton w-4 h-4 rounded mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-1/2" />
            </div>
            <div className="skeleton w-14 h-5 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Email skeleton */}
      <div className="glass-card p-5">
        <div className="skeleton w-8 h-8 rounded-xl mb-4" />
        <SkeletonLine className="w-28 mb-4" />
        <div className="skeleton w-full h-24 rounded-xl mb-3" />
        <div className="space-y-2">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-5/6" />
          <SkeletonLine className="w-4/6" />
          <SkeletonLine className="w-3/6" />
        </div>
      </div>

      {/* Schedule skeleton */}
      <div className="glass-card p-5">
        <div className="skeleton w-8 h-8 rounded-xl mb-4" />
        <SkeletonLine className="w-32 mb-4" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="skeleton w-14 h-4 flex-shrink-0 rounded" />
            <div className="flex-1 space-y-1">
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Insight skeleton */}
      <div className="glass-card p-5">
        <div className="skeleton w-8 h-8 rounded-xl mb-4" />
        <SkeletonLine className="w-24 mb-4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="p-3 rounded-xl bg-surface-hover mb-2 space-y-1.5">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Inline spinner ─────────────────────────────
export const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`animate-spin ${className}`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
    <path
      d="M12 2a10 10 0 0110 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
