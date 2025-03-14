import React from 'react';

const Logo = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <span className={`font-bold ${sizeClasses[size] || sizeClasses.medium}`}>
      <span className="text-primary-600">Locked</span>
      <span className="text-secondary-800">IN</span>
    </span>
  );
};

export default Logo;
