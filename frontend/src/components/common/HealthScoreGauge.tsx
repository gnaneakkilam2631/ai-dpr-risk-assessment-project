import React from 'react';

interface HealthScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showStatus?: boolean;
  statusText?: string;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  maxScore = 100,
  size = 180,
  strokeWidth = 14,
  label = 'DPR HEALTH SCORE',
  showStatus = true,
  statusText,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = '#2563eb'; // blue
  let glowColor = 'rgba(37, 99, 235, 0.2)';
  let verdict = statusText || 'Good — Minor Issues Detected';

  if (score >= 85) {
    color = '#10b981'; // emerald
    glowColor = 'rgba(16, 185, 129, 0.25)';
    if (!statusText) verdict = 'Excellent — High Conformance';
  } else if (score >= 70) {
    color = '#2563eb'; // blue
    glowColor = 'rgba(37, 99, 235, 0.25)';
    if (!statusText) verdict = 'Good — Minor Critical Issues';
  } else if (score >= 50) {
    color = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.25)';
    if (!statusText) verdict = 'Moderate — Significant Gaps';
  } else {
    color = '#ef4444'; // red
    glowColor = 'rgba(239, 68, 68, 0.25)';
    if (!statusText) verdict = 'Poor — Rejection Recommended';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: `drop-shadow(0 4px 10px ${glowColor})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            {score}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            out of {maxScore}
          </span>
        </div>
      </div>

      {showStatus && (
        <div className="mt-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div
            className="text-sm font-semibold mt-0.5 px-3 py-0.5 rounded-full inline-block"
            style={{ color, backgroundColor: glowColor }}
          >
            {verdict}
          </div>
        </div>
      )}
    </div>
  );
};
