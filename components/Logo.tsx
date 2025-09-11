import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Cat Ears */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg 
          viewBox="0 0 24 24" 
          className="w-full h-full text-cookitie-blue-600"
          fill="currentColor"
        >
          {/* Cat Ears - mais fiel ao design */}
          <path d="M6 2C6 1 7 1 8 2C9 1 10 1 10 2C10 3 9 4 8 3C7 4 6 3 6 2Z" />
          <path d="M14 2C14 1 15 1 16 2C17 1 18 1 18 2C18 3 17 4 16 3C15 4 14 3 14 2Z" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-cookitie font-bold text-cookitie-blue-600 ${textSizeClasses[size]} tracking-tight`}>
            Cookittie
          </span>
          <span className="text-xs text-gray-500 font-medium tracking-wider">
            EST. 2025
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
