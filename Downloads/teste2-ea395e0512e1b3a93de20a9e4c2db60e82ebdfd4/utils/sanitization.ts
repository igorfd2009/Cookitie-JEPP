// Sistema de Sanitização de Dados para Segurança
// Protege contra XSS, injeção de código e ataques maliciosos

/**
 * Sanitiza texto básico removendo tags HTML e scripts
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove scripts completos
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove atributos de eventos
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs suspeitos
    .replace(/data:\s*text\/html/gi, '')
    // Remove vbscript
    .replace(/vbscript:/gi, '')
    // Remove expressões CSS perigosas
    .replace(/expression\s*\(/gi, '')
    // Remove comentários HTML
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ');
}

/**
 * Sanitiza HTML permitindo tags seguras
 */
export function sanitizeHTML(html: string, allowedTags: string[] = ['b', 'i', 'em', 'strong', 'a', 'br', 'p']): string {
  if (!html || typeof html !== 'string') return '';
  
  // Remove scripts e tags perigosas primeiro
  let sanitized = sanitizeInput(html);
  
  // Permite apenas tags seguras
  const safeTags = allowedTags.join('|');
  const tagRegex = new RegExp(`<(/?(?:${safeTags})\b[^>]*)>`, 'gi');
  
  // Remove atributos perigosos das tags permitidas
  sanitized = sanitized.replace(tagRegex, (_, tagContent) => {
    // Remove atributos perigosos
    const cleanTag = tagContent
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '') // Eventos
      .replace(/\s*javascript:/gi, '') // javascript: URLs
      .replace(/\s*data:\s*text\/html/gi, '') // data URLs
      .replace(/\s*vbscript:/gi, '') // vbscript
      .replace(/\s*expression\s*\(/gi, '') // CSS expressions
      .replace(/\s*style\s*=\s*["'][^"']*["']/gi, '') // Estilos inline
      .replace(/\s*class\s*=\s*["'][^"']*["']/gi, '') // Classes (opcional)
      .replace(/\s*id\s*=\s*["'][^"']*["']/gi, ''); // IDs (opcional)
    
    return `<${cleanTag}>`;
  });
  
  return sanitized;
}

/**
 * Sanitiza URLs removendo protocolos perigosos
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const cleanURL = url.trim();
  
  // Lista de protocolos permitidos
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];
  
  // Verifica se a URL tem protocolo permitido
  const hasAllowedProtocol = allowedProtocols.some(protocol => 
    cleanURL.toLowerCase().startsWith(protocol)
  );
  
  if (!hasAllowedProtocol) {
    // Se não tem protocolo, assume http
    return `https://${cleanURL}`;
  }
  
  // Remove protocolos perigosos
  return cleanURL
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    .replace(/data:\s*text\/javascript/gi, '');
}

/**
 * Sanitiza emails removendo caracteres perigosos
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    // Remove caracteres perigosos
    .replace(/[<>\"'&]/g, '')
    // Remove múltiplos pontos
    .replace(/\.{2,}/g, '.')
    // Remove pontos no início ou fim
    .replace(/^\.+|\.+$/g, '')
    // Remove espaços
    .replace(/\s/g, '');
}

/**
 * Sanitiza números removendo caracteres não numéricos
 */
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input;
  }
  
  if (!input || typeof input !== 'string') return null;
  
  const cleanNumber = input
    .trim()
    // Remove tudo exceto números, pontos e vírgulas
    .replace(/[^\d.,]/g, '')
    // Converte vírgula para ponto
    .replace(',', '.');
  
  const number = parseFloat(cleanNumber);
  return isNaN(number) ? null : number;
}

/**
 * Sanitiza telefone removendo caracteres não numéricos
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone
    .trim()
    // Remove tudo exceto números, +, -, (, ), espaços
    .replace(/[^\d+\-()\s]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ')
    // Remove espaços no início e fim
    .trim();
}

/**
 * Sanitiza nome removendo caracteres perigosos mas mantendo acentos
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ')
    // Remove caracteres especiais perigosos (mantém acentos)
    .replace(/[<>\"'&]/g, '')
    // Capitaliza primeira letra de cada palavra
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Sanitiza endereço removendo caracteres perigosos
 */
export function sanitizeAddress(address: string): string {
  if (!address || typeof address !== 'string') return '';
  
  return address
    .trim()
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ')
    // Remove caracteres especiais perigosos
    .replace(/[<>\"'&]/g, '')
    // Capitaliza primeira letra de cada palavra
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Sanitiza CPF removendo caracteres não numéricos
 */
export function sanitizeCPF(cpf: string): string {
  if (!cpf || typeof cpf !== 'string') return '';
  
  return cpf
    .trim()
    // Remove tudo exceto números
    .replace(/\D/g, '')
    // Limita a 11 dígitos
    .slice(0, 11);
}

/**
 * Sanitiza CNPJ removendo caracteres não numéricos
 */
export function sanitizeCNPJ(cnpj: string): string {
  if (!cnpj || typeof cnpj !== 'string') return '';
  
  return cnpj
    .trim()
    // Remove tudo exceto números
    .replace(/\D/g, '')
    // Limita a 14 dígitos
    .slice(0, 14);
}

/**
 * Sanitiza CEP removendo caracteres não numéricos
 */
export function sanitizeCEP(cep: string): string {
  if (!cep || typeof cep !== 'string') return '';
  
  return cep
    .trim()
    // Remove tudo exceto números
    .replace(/\D/g, '')
    // Limita a 8 dígitos
    .slice(0, 8);
}

/**
 * Sanitiza objeto completo aplicando sanitização apropriada para cada campo
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fieldConfig: Record<keyof T, 'text' | 'html' | 'url' | 'email' | 'number' | 'phone' | 'name' | 'address' | 'cpf' | 'cnpj' | 'cep'>
): T {
  const sanitized = { ...obj } as any;
  
  for (const [key, config] of Object.entries(fieldConfig)) {
    if (sanitized[key] && typeof sanitized[key] === 'string') {
      switch (config) {
        case 'text':
          sanitized[key] = sanitizeInput(sanitized[key]);
          break;
        case 'html':
          sanitized[key] = sanitizeHTML(sanitized[key]);
          break;
        case 'url':
          sanitized[key] = sanitizeURL(sanitized[key]);
          break;
        case 'email':
          sanitized[key] = sanitizeEmail(sanitized[key]);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(sanitized[key]);
          break;
        case 'name':
          sanitized[key] = sanitizeName(sanitized[key]);
          break;
        case 'address':
          sanitized[key] = sanitizeAddress(sanitized[key]);
          break;
        case 'cpf':
          sanitized[key] = sanitizeCPF(sanitized[key]);
          break;
        case 'cnpj':
          sanitized[key] = sanitizeCNPJ(sanitized[key]);
          break;
        case 'cep':
          sanitized[key] = sanitizeCEP(sanitized[key]);
          break;
      }
    } else if (config === 'number') {
      sanitized[key] = sanitizeNumber(sanitized[key]);
    }
  }
  
  return sanitized as T;
}

/**
 * Valida se um email está em formato válido
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um CPF está em formato válido
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = sanitizeCPF(cpf);
  
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) return false;
  
  return true;
}

/**
 * Valida se um CNPJ está em formato válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = sanitizeCNPJ(cnpj);
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ[i]) * weights1[i];
  }
  let remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (remainder !== parseInt(cleanCNPJ[12])) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ[i]) * weights2[i];
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (remainder !== parseInt(cleanCNPJ[13])) return false;
  
  return true;
}

/**
 * Valida se um CEP está em formato válido
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = sanitizeCEP(cep);
  return cleanCEP.length === 8;
}

/**
 * Hook para sanitização automática em formulários React
 */
export function useSanitization() {
  const sanitizeFormData = <T extends Record<string, any>>(
    data: T,
    config: Record<keyof T, 'text' | 'html' | 'url' | 'email' | 'number' | 'phone' | 'name' | 'address' | 'cpf' | 'cnpj' | 'cep'>
  ) => {
    return sanitizeObject(data, config);
  };
  
  const validateAndSanitize = <T extends Record<string, any>>(
    data: T,
    config: Record<keyof T, 'text' | 'html' | 'url' | 'email' | 'number' | 'phone' | 'name' | 'address' | 'cpf' | 'cnpj' | 'cep'>,
    validations: Record<keyof T, () => boolean>
  ) => {
    const sanitized = sanitizeObject(data, config);
    const errors: string[] = [];
    
    for (const [key, validation] of Object.entries(validations)) {
      if (!validation()) {
        errors.push(`Campo ${key} inválido`);
      }
    }
    
    return { sanitized, errors, isValid: errors.length === 0 };
  };
  
  return {
    sanitizeFormData,
    validateAndSanitize,
    sanitizeInput,
    sanitizeHTML,
    sanitizeURL,
    sanitizeEmail,
    sanitizeNumber,
    sanitizePhone,
    sanitizeName,
    sanitizeAddress,
    sanitizeCPF,
    sanitizeCNPJ,
    sanitizeCEP,
    isValidEmail,
    isValidCPF,
    isValidCNPJ,
    isValidCEP
  };
}

// Exportações para uso direto
export const sanitizationUtils = {
  sanitizeInput,
  sanitizeHTML,
  sanitizeURL,
  sanitizeEmail,
  sanitizeNumber,
  sanitizePhone,
  sanitizeName,
  sanitizeAddress,
  sanitizeCPF,
  sanitizeCNPJ,
  sanitizeCEP,
  sanitizeObject,
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidCEP,
  useSanitization
};
