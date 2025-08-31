// Sistema de Rate Limiting para Proteção contra Ataques
// Protege endpoints de autenticação contra tentativas excessivas

interface RateLimitAttempt {
  timestamp: number;
  action: string;
  success: boolean;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

// Armazenamento em memória para tentativas (em produção, considere Redis)
const attempts = new Map<string, RateLimitAttempt[]>();
const blockedIPs = new Map<string, number>();

// Configurações padrão
const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutos
  blockDurationMs: 30 * 60 * 1000, // 30 minutos
};

/**
 * Verifica se um IP está bloqueado
 */
export function isIPBlocked(ip: string): boolean {
  const blockedUntil = blockedIPs.get(ip);
  if (!blockedUntil) return false;
  
  if (Date.now() > blockedUntil) {
    blockedIPs.delete(ip);
    return false;
  }
  
  return true;
}

/**
 * Verifica rate limit para uma ação específica
 */
export function checkRateLimit(
  ip: string, 
  action: string = 'default',
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remainingAttempts: number; blockedUntil?: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  
  // Verificar se IP está bloqueado
  if (isIPBlocked(ip)) {
    const blockedUntil = blockedIPs.get(ip)!;
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil
    };
  }
  
  // Obter tentativas existentes
  const key = `${ip}:${action}`;
  const userAttempts = attempts.get(key) || [];
  
  // Remover tentativas antigas
  const recentAttempts = userAttempts.filter(
    (attempt) => now - attempt.timestamp < finalConfig.windowMs
  );
  
  // Contar tentativas falhadas recentes
  const failedAttempts = recentAttempts.filter(
    (attempt) => !attempt.success
  );
  
  const remainingAttempts = Math.max(0, finalConfig.maxAttempts - failedAttempts.length);
  
  if (failedAttempts.length >= finalConfig.maxAttempts) {
    // Bloquear IP
    const blockedUntil = now + finalConfig.blockDurationMs;
    blockedIPs.set(ip, blockedUntil);
    
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil
    };
  }
  
  return {
    allowed: true,
    remainingAttempts
  };
}

/**
 * Registra uma tentativa (sucesso ou falha)
 */
export function recordAttempt(
  ip: string, 
  action: string = 'default', 
  success: boolean = false
): void {
  const key = `${ip}:${action}`;
  const now = Date.now();
  
  const userAttempts = attempts.get(key) || [];
  userAttempts.push({ timestamp: now, action, success });
  
  // Manter apenas tentativas dos últimos 24 horas para economia de memória
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const recentAttempts = userAttempts.filter(
    (attempt) => attempt.timestamp > oneDayAgo
  );
  
  attempts.set(key, recentAttempts);
}

/**
 * Obtém estatísticas de rate limiting para um IP
 */
export function getRateLimitStats(ip: string, action: string = 'default') {
  const key = `${ip}:${action}`;
  const userAttempts = attempts.get(key) || [];
  const now = Date.now();
  
  const recentAttempts = userAttempts.filter(
    (attempt) => now - attempt.timestamp < DEFAULT_CONFIG.windowMs
  );
  
  const failedAttempts = recentAttempts.filter(
    (attempt) => !attempt.success
  );
  
  const successAttempts = recentAttempts.filter(
    (attempt) => attempt.success
  );
  
  return {
    totalAttempts: recentAttempts.length,
    failedAttempts: failedAttempts.length,
    successAttempts: successAttempts.length,
    remainingAttempts: Math.max(0, DEFAULT_CONFIG.maxAttempts - failedAttempts.length),
    isBlocked: isIPBlocked(ip),
    blockedUntil: blockedIPs.get(ip),
    windowMs: DEFAULT_CONFIG.windowMs
  };
}

/**
 * Limpa dados antigos para economia de memória
 */
export function cleanupOldData(): void {
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  
  // Limpar tentativas antigas
  for (const [key, userAttempts] of attempts.entries()) {
    const recentAttempts = userAttempts.filter(
      (attempt) => attempt.timestamp > oneDayAgo
    );
    
    if (recentAttempts.length === 0) {
      attempts.delete(key);
    } else {
      attempts.set(key, recentAttempts);
    }
  }
  
  // Limpar IPs bloqueados expirados
  for (const [ip, blockedUntil] of blockedIPs.entries()) {
    if (now > blockedUntil) {
      blockedIPs.delete(ip);
    }
  }
}

/**
 * Reseta rate limiting para um IP específico (útil para admin)
 */
export function resetRateLimit(ip: string, action: string = 'default'): void {
  const key = `${ip}:${action}`;
  attempts.delete(key);
  blockedIPs.delete(ip);
}

/**
 * Obtém estatísticas gerais do sistema
 */
export function getSystemStats() {
  return {
    totalTrackedIPs: attempts.size,
    totalBlockedIPs: blockedIPs.size,
    memoryUsage: {
      attemptsSize: attempts.size,
      blockedIPsSize: blockedIPs.size
    }
  };
}

// Limpeza automática a cada hora
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldData, 60 * 60 * 1000);
}
