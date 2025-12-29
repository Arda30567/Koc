import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-lg flex items-center justify-center`}>
        <svg
          className="text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"
            opacity="0.8"
          />
          <path
            d="M12 2v20c5.16-1.261 9-5.45 9-11V7l-9-5z"
            opacity="0.6"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <span className="ml-3 text-xl font-bold text-gray-900">FitCoach</span>
    </div>
  );
}