import { useState, useEffect, useCallback } from 'react';
import { checkRateLimit, recordAttempt, getRateLimitStats } from '../utils/rateLimiting';

interface RateLimitState {
  isBlocked: boolean;
  remainingAttempts: number;
  blockedUntil?: number;
  lastAttempt: number;
}

interface UseRateLimitOptions {
  action: string;
  maxAttempts?: number;
  windowMs?: number;
  blockDurationMs?: number;
  onBlocked?: (blockedUntil: number) => void;
  onAttemptsExhausted?: () => void;
}

/**
 * Hook para gerenciar rate limiting no frontend
 * Útil para formulários de login, cadastro e outras ações sensíveis
 */
export function useRateLimit(options: UseRateLimitOptions) {
  const {
    action,
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000,
    blockDurationMs = 30 * 60 * 1000,
    onBlocked,
    onAttemptsExhausted
  } = options;

  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isBlocked: false,
    remainingAttempts: maxAttempts,
    lastAttempt: 0
  });

  // Simular IP do usuário (em produção, isso viria do backend)
  const [userIP] = useState(() => {
    // Gerar IP simulado baseado no timestamp
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  // Verificar rate limit atual
  const checkCurrentLimit = useCallback(() => {
    const result = checkRateLimit(userIP, action, {
      maxAttempts,
      windowMs,
      blockDurationMs
    });

    setRateLimitState(prev => ({
      ...prev,
      isBlocked: !result.allowed,
      remainingAttempts: result.remainingAttempts,
      blockedUntil: result.blockedUntil
    }));

    return result;
  }, [userIP, action, maxAttempts, windowMs, blockDurationMs]);

  // Verificar rate limit ao montar o componente
  useEffect(() => {
    checkCurrentLimit();
  }, [checkCurrentLimit]);

  // Verificar se ainda está bloqueado periodicamente
  useEffect(() => {
    if (rateLimitState.isBlocked && rateLimitState.blockedUntil) {
      const checkInterval = setInterval(() => {
        const now = Date.now();
        if (now >= rateLimitState.blockedUntil!) {
          checkCurrentLimit();
        }
      }, 1000); // Verificar a cada segundo

      return () => clearInterval(checkInterval);
    }
  }, [rateLimitState.isBlocked, rateLimitState.blockedUntil, checkCurrentLimit]);

  // Executar uma ação com verificação de rate limit
  const executeWithRateLimit = useCallback(async <T>(
    actionFn: () => Promise<T> | T,
    onSuccess?: (result: T) => void,
    onError?: (error: any) => void
  ): Promise<T | null> => {
    // Verificar rate limit antes de executar
    const limitCheck = checkCurrentLimit();
    
    if (!limitCheck.allowed) {
      if (onBlocked && limitCheck.blockedUntil) {
        onBlocked(limitCheck.blockedUntil);
      }
      return null;
    }

    try {
      // Executar a ação
      const result = await actionFn();
      
      // Registrar sucesso
      recordAttempt(userIP, action, true);
      
      // Atualizar estado
      setRateLimitState(prev => ({
        ...prev,
        remainingAttempts: Math.max(0, prev.remainingAttempts - 1),
        lastAttempt: Date.now()
      }));

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      // Registrar falha
      recordAttempt(userIP, action, false);
      
      // Verificar se excedeu o limite
      const newLimitCheck = checkCurrentLimit();
      
      if (!newLimitCheck.allowed) {
        if (onAttemptsExhausted) {
          onAttemptsExhausted();
        }
        if (onBlocked && newLimitCheck.blockedUntil) {
          onBlocked(newLimitCheck.blockedUntil);
        }
      }

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [userIP, action, checkCurrentLimit, onBlocked, onAttemptsExhausted]);

  // Verificar se pode executar uma ação
  const canExecute = useCallback(() => {
    return !rateLimitState.isBlocked && rateLimitState.remainingAttempts > 0;
  }, [rateLimitState.isBlocked, rateLimitState.remainingAttempts]);

  // Obter estatísticas detalhadas
  const getStats = useCallback(() => {
    return getRateLimitStats(userIP, action);
  }, [userIP, action]);

  // Formatar tempo restante de bloqueio
  const getBlockedTimeRemaining = useCallback(() => {
    if (!rateLimitState.blockedUntil) return 0;
    
    const remaining = rateLimitState.blockedUntil - Date.now();
    return Math.max(0, remaining);
  }, [rateLimitState.blockedUntil]);

  // Formatar tempo restante de bloqueio em formato legível
  const getBlockedTimeFormatted = useCallback(() => {
    const remaining = getBlockedTimeRemaining();
    if (remaining === 0) return '';

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [getBlockedTimeRemaining]);

  return {
    // Estado
    isBlocked: rateLimitState.isBlocked,
    remainingAttempts: rateLimitState.remainingAttempts,
    blockedUntil: rateLimitState.blockedUntil,
    lastAttempt: rateLimitState.lastAttempt,
    
    // Métodos
    executeWithRateLimit,
    canExecute,
    checkCurrentLimit,
    getStats,
    getBlockedTimeRemaining,
    getBlockedTimeFormatted,
    
    // Utilitários
    userIP
  };
}

/**
 * Hook simplificado para formulários de autenticação
 */
export function useAuthRateLimit() {
  return useRateLimit({
    action: 'auth',
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos
    onBlocked: (blockedUntil) => {
      console.warn(`IP bloqueado até ${new Date(blockedUntil).toLocaleString()}`);
    },
    onAttemptsExhausted: () => {
      console.warn('Tentativas de autenticação esgotadas');
    }
  });
}

/**
 * Hook para ações de cadastro
 */
export function useSignupRateLimit() {
  return useRateLimit({
    action: 'signup',
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 horas
    onBlocked: (blockedUntil) => {
      console.warn(`IP bloqueado para cadastro até ${new Date(blockedUntil).toLocaleString()}`);
    },
    onAttemptsExhausted: () => {
      console.warn('Tentativas de cadastro esgotadas');
    }
  });
}

/**
 * Hook para reset de senha
 */
export function usePasswordResetRateLimit() {
  return useRateLimit({
    action: 'password_reset',
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 horas
    onBlocked: (blockedUntil) => {
      console.warn(`IP bloqueado para reset de senha até ${new Date(blockedUntil).toLocaleString()}`);
    },
    onAttemptsExhausted: () => {
      console.warn('Tentativas de reset de senha esgotadas');
    }
  });
}
