import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendUp?: boolean;
  color?: string;
}

const gradientMap: Record<string, { bg: string; iconBg: string; border: string }> = {
  gold: {
    bg: 'linear-gradient(135deg, #FDF8E8 0%, #F9EDC5 50%, #F3DA8B 100%)',
    iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    border: 'rgba(201,154,46,0.2)',
  },
  accent: {
    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FDBA74 100%)',
    iconBg: 'linear-gradient(135deg, #F97316, #EA580C)',
    border: 'rgba(249,115,22,0.2)',
  },
  success: {
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
    iconBg: 'linear-gradient(135deg, #10B981, #059669)',
    border: 'rgba(16,185,129,0.2)',
  },
  blue: {
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
    iconBg: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    border: 'rgba(59,130,246,0.2)',
  },
  error: {
    bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FECACA 100%)',
    iconBg: 'linear-gradient(135deg, #EF4444, #DC2626)',
    border: 'rgba(239,68,68,0.2)',
  },
  warning: {
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
    iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    border: 'rgba(245,158,11,0.2)',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp = true,
  color = 'gold',
}) => {
  const colors = gradientMap[color] || gradientMap.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      className="rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
        style={{ background: colors.iconBg, transform: 'translate(30%, -30%)', filter: 'blur(40px)' }}
      />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-surface-600 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-surface-900">{value}</p>
            {subtitle && <p className="text-sm text-surface-500">{subtitle}</p>}
          </div>
        </div>
        {icon && (
          <div
            className="rounded-xl p-3 flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: colors.iconBg }}
          >
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 relative z-10">
          <div
            className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
              trendUp ? 'bg-success-100/80 text-success-700' : 'bg-error-100/80 text-error-700'
            }`}
          >
            {trendUp ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-xs text-surface-500">vs last period</span>
        </div>
      )}
    </motion.div>
  );
};
