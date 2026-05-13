import React from 'react';

const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-muted rounded-md ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
