import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const ProgressRing = forwardRef(({ className, progress = 0, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: { dimension: 24, strokeWidth: 2 },
    md: { dimension: 32, strokeWidth: 3 },
    lg: { dimension: 40, strokeWidth: 4 }
  };

  const { dimension, strokeWidth } = sizes[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div ref={ref} className={cn('relative inline-flex items-center justify-center', className)} {...props}>
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="transform -rotate-90"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#A29BFE" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-medium text-gray-600">
        {Math.round(progress)}%
      </span>
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';

export default ProgressRing;