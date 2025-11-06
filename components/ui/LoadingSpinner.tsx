import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = '' }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };
  return (
    <div
      style={style}
      className={`animate-spin rounded-full border-2 border-t-transparent border-emerald-500 ${className}`}
    />
  );
};