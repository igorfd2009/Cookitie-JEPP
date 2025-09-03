

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  variant?: 'default' | 'dots' | 'pulse';
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  color = 'blue',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    blue: 'border-t-blue-600',
    green: 'border-t-green-600',
    red: 'border-t-red-600',
    yellow: 'border-t-yellow-600',
    purple: 'border-t-purple-600',
    gray: 'border-t-gray-600',
  };

  // Variante padrão - spinner circular
  if (variant === 'default') {
    return (
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
        role="status"
        aria-label="Carregando..."
      />
    );
  }

  // Variante dots - três pontos animados
  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`} role="status" aria-label="Carregando...">
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  // Variante pulse - círculo pulsante
  if (variant === 'pulse') {
    return (
      <div 
        className={`animate-pulse rounded-full bg-current ${sizeClasses[size]} ${className}`}
        role="status"
        aria-label="Carregando..."
      />
    );
  }

  return null;
}

// Componentes especializados para casos de uso comuns
export function LoadingSpinnerSmall({ className, color }: Omit<LoadingSpinnerProps, 'size'>) {
  return <LoadingSpinner size="sm" className={className} color={color} />;
}

export function LoadingSpinnerMedium({ className, color }: Omit<LoadingSpinnerProps, 'size'>) {
  return <LoadingSpinner size="md" className={className} color={color} />;
}

export function LoadingSpinnerLarge({ className, color }: Omit<LoadingSpinnerProps, 'size'>) {
  return <LoadingSpinner size="lg" className={className} color={color} />;
}

// Componente de loading com texto
interface LoadingSpinnerWithTextProps extends LoadingSpinnerProps {
  text?: string;
  textPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function LoadingSpinnerWithText({ 
  text = 'Carregando...',
  textPosition = 'bottom',
  ...props 
}: LoadingSpinnerWithTextProps) {
  const positionClasses = {
    top: 'flex-col-reverse',
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row',
  };

  const spacingClasses = {
    top: 'space-y-reverse space-y-2',
    bottom: 'space-y-2',
    left: 'space-x-reverse space-x-2',
    right: 'space-x-2',
  };

  return (
    <div className={`flex items-center justify-center ${positionClasses[textPosition]} ${spacingClasses[textPosition]}`}>
      <LoadingSpinner {...props} />
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
}

// Componente de loading para botões
interface ButtonLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonLoadingSpinner({ size = 'sm', className }: ButtonLoadingSpinnerProps) {
  return (
    <LoadingSpinner 
      size={size} 
      className={`text-current ${className}`}
      variant="default"
    />
  );
}

// Componente de loading para páginas inteiras
export function PageLoadingSpinner({ 
  text = 'Carregando página...',
  className = ''
}: { 
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  );
}

// Componente de loading para seções
export function SectionLoadingSpinner({ 
  text = 'Carregando...',
  className = ''
}: { 
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size="md" className="mb-3" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

// Componente de loading inline para texto
export function InlineLoadingSpinner({ 
  text = 'Carregando',
  className = ''
}: { 
  text?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center space-x-2 ${className}`}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </span>
  );
}
