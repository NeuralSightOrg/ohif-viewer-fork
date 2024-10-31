import React from 'react';
import classNames from 'classnames';

function LoadingIndicatorProgress({ className, textBlock, progress }) {
  const imageSize = 96; // 24rem = 96px
  const strokeWidth = 3;
  const radius = imageSize / 2;
  const svgSize = imageSize + strokeWidth * 2;

  return (
    <div
      className={classNames(
        'absolute top-0 left-0 z-50 flex flex-col items-center justify-center space-y-5',
        className
      )}
    >
      <div className="relative">
        {/* Glow effect SVG */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Subtle background circle */}
          <circle
            className="text-gray-700/10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />

          {/* Glowing arc */}
          <circle
            className="animate-glow-spin"
            strokeWidth={strokeWidth}
            stroke="url(#glowGradient)"
            strokeLinecap="round"
            fill="none"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
            strokeDasharray="20 180"
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="glowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                className="stop-blue-500/0"
              />
              <stop
                offset="50%"
                className="stop-blue-500"
              />
              <stop
                offset="100%"
                className="stop-blue-500/0"
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Image container */}
        <div className="relative h-24 w-24">
          {/* Subtle overlay */}
          <div className="absolute inset-0 rounded-full bg-black/10" />
          <img
            src="/assets/logo.gif"
            alt="Neural Sight Logo"
            className="h-full w-full rounded-full object-contain"
          />
        </div>
      </div>

      {textBlock && <div className="mt-4 text-center text-white">{textBlock}</div>}
    </div>
  );
}

export default LoadingIndicatorProgress;
