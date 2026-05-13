import React from 'react';

const LoadingSpinner = ({ size = "md", fullPage = false }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  const spinner = (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full border-primary/10`}></div>
      <div className={`absolute inset-0 ${sizes[size]} rounded-full border-primary border-t-transparent animate-spin`}></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background space-y-4">
        {spinner}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing system...</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
