import React from 'react';

interface SkeletonCardProps {
  count?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  count = 1,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl shadow-card p-6 ${className}`}
        >
          <div className="skeleton h-4 w-24 mb-4 rounded" />
          <div className="skeleton h-8 w-32 mb-4 rounded" />
          <div className="skeleton h-4 w-full rounded mb-2" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      ))}
    </>
  );
};

interface SkeletonLineProps {
  count?: number;
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  count = 1,
  width = 'w-full',
  height = 'h-4',
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${width} ${height} rounded mb-2 ${className}`}
        />
      ))}
    </>
  );
};

interface SkeletonCircleProps {
  count?: number;
  size?: string;
  className?: string;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  count = 1,
  size = 'w-12 h-12',
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${size} rounded-full ${className}`}
        />
      ))}
    </>
  );
};

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 3,
  rows = 2,
  className = '',
}) => {
  const gridClass = `grid gap-4 grid-cols-${columns}`;

  return (
    <div className={`${gridClass} ${className}`}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
