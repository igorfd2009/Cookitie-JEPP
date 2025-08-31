// Sistema de Validação Centralizado

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

export class Validator {
  // Validação de email
  static email(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email) {
      return { isValid: false, error: 'Email é obrigatório' }
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Email inválido' }
    }
    
    return { isValid: true }
  }

  // Validação de telefone brasileiro
  static phone(phone: string): ValidationResult {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    
    if (!phone) {
      return { isValid: false, error: 'Telefone é obrigatório' }
    }
    
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: 'Telefone deve estar no formato (11) 99999-9999' }
    }
    
    return { isValid: true }
  }

  // Validação de senha
  static password(password: string, minLength: number = 6): ValidationResult {
    if (!password) {
      return { isValid: false, error: 'Senha é obrigatória' }
    }
    
    if (password.length < minLength) {
      return { isValid: false, error: `Senha deve ter pelo menos ${minLength} caracteres` }
    }
    
    return { isValid: true }
  }

  // Validação de nome
  static name(name: string): ValidationResult {
    if (!name) {
      return { isValid: false, error: 'Nome é obrigatório' }
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' }
    }
    
    if (name.trim().length > 100) {
      return { isValid: false, error: 'Nome muito longo' }
    }
    
    return { isValid: true }
  }

  // Validação de quantidade
  static quantity(quantity: number, min: number = 1, max: number = 100): ValidationResult {
    if (!quantity || isNaN(quantity)) {
      return { isValid: false, error: 'Quantidade inválida' }
    }
    
    if (quantity < min) {
      return { isValid: false, error: `Quantidade mínima é ${min}` }
    }
    
    if (quantity > max) {
      return { isValid: false, error: `Quantidade máxima é ${max}` }
    }
    
    return { isValid: true }
  }

  // Validação de valor monetário
  static price(price: number, min: number = 0): ValidationResult {
    if (!price || isNaN(price)) {
      return { isValid: false, error: 'Preço inválido' }
    }
    
    if (price < min) {
      return { isValid: false, error: `Preço mínimo é R$ ${min.toFixed(2)}` }
    }
    
    return { isValid: true }
  }

  // Validação genérica com regras
  static field(value: any, rules: ValidationRule): ValidationResult {
    // Verificar se é obrigatório
    if (rules.required && (!value || value.toString().trim() === '')) {
      return { isValid: false, error: rules.message || 'Campo obrigatório' }
    }
    
    // Se não há valor e não é obrigatório, passar
    if (!value && !rules.required) {
      return { isValid: true }
    }
    
    const stringValue = value.toString()
    
    // Verificar comprimento mínimo
    if (rules.minLength && stringValue.length < rules.minLength) {
      return { 
        isValid: false, 
        error: rules.message || `Mínimo de ${rules.minLength} caracteres` 
      }
    }
    
    // Verificar comprimento máximo
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return { 
        isValid: false, 
        error: rules.message || `Máximo de ${rules.maxLength} caracteres` 
      }
    }
    
    // Verificar padrão
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return { 
        isValid: false, 
        error: rules.message || 'Formato inválido' 
      }
    }
    
    // Verificar validação customizada
    if (rules.custom && !rules.custom(value)) {
      return { 
        isValid: false, 
        error: rules.message || 'Valor inválido' 
      }
    }
    
    return { isValid: true }
  }

  // Validar múltiplos campos
  static validateForm(fields: Record<string, { value: any; rules: ValidationRule }>): {
    isValid: boolean
    errors: Record<string, string>
    firstError?: string
  } {
    const errors: Record<string, string> = {}
    let firstError: string | undefined = undefined
    
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      const result = this.field(fieldConfig.value, fieldConfig.rules)
      
      if (!result.isValid && result.error) {
        errors[fieldName] = result.error
        if (!firstError) {
          firstError = result.error
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstError
    }
  }
}

// Utilitários de formatação
export class Formatter {
  // Formatar telefone brasileiro
  static phone(value: string): string {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  // Formatar CPF
  static cpf(value: string): string {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  // Formatar moeda
  static currency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Formatar data
  static date(date: Date | string): string {
    const d = new Date(date)
    return new Intl.DateTimeFormat('pt-BR').format(d)
  }

  // Formatar data/hora
  static datetime(date: Date | string): string {
    const d = new Date(date)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  }
}

// Hook para formulários
export const useFormValidation = () => {
  const validateAndFormat = {
    email: (value: string) => ({
      formatted: value.toLowerCase().trim(),
      validation: Validator.email(value)
    }),
    
    phone: (value: string) => ({
      formatted: Formatter.phone(value),
      validation: Validator.phone(Formatter.phone(value))
    }),
    
    name: (value: string) => ({
      formatted: value.trim(),
      validation: Validator.name(value)
    }),
    
    password: (value: string, minLength?: number) => ({
      formatted: value,
      validation: Validator.password(value, minLength)
    })
  }
  
  return { validateAndFormat, Validator, Formatter }
}
