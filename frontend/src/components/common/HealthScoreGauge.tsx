import React from "react";

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
  label = "DPR RISK SCORE",
  showStatus = true,
  statusText,
}) => {
  // ============================================================
  // NORMALIZE SCORE
  // ============================================================

  const numericScore = Number(score);

  const safeScore =
    Number.isFinite(numericScore) && numericScore >= 0
      ? Math.min(numericScore, maxScore)
      : 0;

  const percentage =
    maxScore > 0
      ? Math.min(100, Math.max(0, (safeScore / maxScore) * 100))
      : 0;

  // ============================================================
  // CIRCLE CALCULATION
  // ============================================================

  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  // ============================================================
  // RISK LEVEL
  //
  // Backend:
  // 0-44   = LOW
  // 45-64  = MEDIUM
  // 65-79  = HIGH
  // 80-100 = CRITICAL
  // ============================================================

  let color = "#10b981";
  let glowColor = "rgba(16, 185, 129, 0.25)";
  let verdict = "LOW RISK";

  if (safeScore >= 80) {
    color = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.25)";
    verdict = "CRITICAL RISK";
  } else if (safeScore >= 65) {
    color = "#f97316";
    glowColor = "rgba(249, 115, 22, 0.25)";
    verdict = "HIGH RISK";
  } else if (safeScore >= 45) {
    color = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.25)";
    verdict = "MEDIUM RISK";
  } else {
    color = "#10b981";
    glowColor = "rgba(16, 185, 129, 0.25)";
    verdict = "LOW RISK";
  }

  // ============================================================
  // STATUS TEXT
  // ============================================================

  const displayStatus =
    statusText && statusText.trim().length > 0
      ? statusText
      : verdict;

  // ============================================================
  // COMPONENT
  // ============================================================

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* ==================================================
              BACKGROUND TRACK
          ================================================== */}

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800"
          />

          {/* ==================================================
              PROGRESS
          ================================================== */}

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
              transition:
                "stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease-in-out",
              filter: `drop-shadow(0 4px 10px ${glowColor})`,
            }}
          />
        </svg>

        {/* ======================================================
            CENTER VALUE
        ====================================================== */}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="font-mono text-4xl font-extrabold tracking-tight"
            style={{
              color,
            }}
          >
            {Math.round(safeScore)}
          </span>

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            out of {maxScore}
          </span>
        </div>
      </div>

      {/* ========================================================
          STATUS
      ======================================================== */}

      {showStatus && (
        <div className="mt-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </div>

          <div
            className="mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold"
            style={{
              color,
              backgroundColor: glowColor,
            }}
          >
            {displayStatus}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthScoreGauge;