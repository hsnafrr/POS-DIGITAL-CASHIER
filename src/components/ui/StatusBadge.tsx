import React from 'react';

interface StatusBadgeProps {
  status: string;
  children?: React.ReactNode;
  className?: string;
}

const statusStyleMap: Record<string, { bg: string; text: string; border: string }> = {
  available: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  occupied: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626', border: 'rgba(239,68,68,0.2)' },
  reserved: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', border: 'rgba(245,158,11,0.2)' },
  cleaning: { bg: 'rgba(59,130,246,0.12)', text: '#2563EB', border: 'rgba(59,130,246,0.2)' },
  active: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  completed: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  pending: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', border: 'rgba(245,158,11,0.2)' },
  cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626', border: 'rgba(239,68,68,0.2)' },
  paid: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  refunded: { bg: 'rgba(59,130,246,0.12)', text: '#2563EB', border: 'rgba(59,130,246,0.2)' },
  preparing: { bg: 'rgba(249,115,22,0.12)', text: '#EA580C', border: 'rgba(249,115,22,0.2)' },
  ready: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  served: { bg: 'rgba(249,115,22,0.12)', text: '#EA580C', border: 'rgba(249,115,22,0.2)' },
  success: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  failed: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626', border: 'rgba(239,68,68,0.2)' },
  inactive: { bg: 'rgba(107,114,128,0.12)', text: '#4B5563', border: 'rgba(107,114,128,0.2)' },
  renovation: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', border: 'rgba(245,158,11,0.2)' },
  confirmed: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  expired: { bg: 'rgba(107,114,128,0.12)', text: '#4B5563', border: 'rgba(107,114,128,0.2)' },
  scheduled: { bg: 'rgba(59,130,246,0.12)', text: '#2563EB', border: 'rgba(59,130,246,0.2)' },
  paused: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', border: 'rgba(245,158,11,0.2)' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  className = '',
}) => {
  const style = statusStyleMap[status.toLowerCase()] || { bg: 'rgba(107,114,128,0.12)', text: '#4B5563', border: 'rgba(107,114,128,0.2)' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${className}`}
      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      {children || status}
    </span>
  );
};
