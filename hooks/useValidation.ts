import { useState, useCallback } from 'react'

export interface ValidationErrors {
  [key: string]: string
}

export interface ValidationRules {
  [key: string]: {
    required?: boolean
    email?: boolean
    phone?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
  }
}

export function useValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar telefone brasileiro
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\(?([14689][0-9]|2[12478]|3[1234578]|5[13-5]|7[134579])\)?\s?9?[0-9]{4}[\s.-]?[0-9]{4}$/
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 11 && phoneRegex.test(phone)
  }

  // Validar telefone brasileiro (alias para compatibilidade)
  const isValidBrazilianPhone = (phone: string): boolean => {
    return isValidPhone(phone)
  }

  // Formatar telefone brasileiro
  const formatPhone = (phone: string): string => {
    if (!phone) return ''
    
    // Remove tudo que não é número
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Limita a 11 dígitos
    const limitedPhone = cleanPhone.substring(0, 11)
    
    // Aplica a máscara baseada no tamanho
    if (limitedPhone.length <= 2) {
      return limitedPhone
    } else if (limitedPhone.length <= 6) {
      return limitedPhone.replace(/(\d{2})(\d{0,4})/, '($1) $2')
    } else if (limitedPhone.length <= 10) {
      // Telefone fixo: (11) 1234-5678
      return limitedPhone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else {
      // Celular: (11) 91234-5678
      return limitedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  // Estado de validação
  const [isValidating, setIsValidating] = useState(false)

  // Validação local
  const validateLocal = (data: Record<string, string>): { valid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {}

    // Validar nome
    if (!data.name?.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (data.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    // Validar email
    if (!data.email?.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!isValidEmail(data.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validar telefone
    if (!data.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!isValidBrazilianPhone(data.phone)) {
      newErrors.phone = 'Telefone inválido'
    }

    return {
      valid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }

  // Validação com servidor (simulada)
  const validateWithServer = async (email: string, phone: string): Promise<{ valid: boolean; errors: Array<{ field: string; message: string }> }> => {
    setIsValidating(true)
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const errors: Array<{ field: string; message: string }> = []

    // Simular validações do servidor
    if (email.includes('spam') || email.includes('fake')) {
      errors.push({ field: 'email', message: 'Este email não é permitido' })
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.startsWith('000') || cleanPhone.startsWith('111')) {
      errors.push({ field: 'phone', message: 'Este telefone não é válido' })
    }

    setIsValidating(false)

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Validar um campo específico
  const validateField = useCallback((
    _fieldName: string,
    value: string,
    rules: ValidationRules[string]
  ): string | null => {
    if (!rules) return null

    // Campo obrigatório
    if (rules.required && (!value || value.trim() === '')) {
      return 'Este campo é obrigatório'
    }

    // Se o campo está vazio e não é obrigatório, não validar outras regras
    if (!value || value.trim() === '') {
      return null
    }

    // Validação de email
    if (rules.email && !isValidEmail(value)) {
      return 'Digite um email válido'
    }

    // Validação de telefone
    if (rules.phone && !isValidPhone(value)) {
      return 'Digite um telefone válido (ex: (11) 99999-9999)'
    }

    // Comprimento mínimo
    if (rules.minLength && value.length < rules.minLength) {
      return `Deve ter pelo menos ${rules.minLength} caracteres`
    }

    // Comprimento máximo
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Deve ter no máximo ${rules.maxLength} caracteres`
    }

    // Padrão regex
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido'
    }

    // Validação customizada
    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }, [])

  // Validar todos os campos
  const validateFields = useCallback((
    data: Record<string, string>,
    rules: ValidationRules
  ): { isValid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {}

    Object.keys(rules).forEach(fieldName => {
      const value = data[fieldName] || ''
      const fieldRules = rules[fieldName]
      const error = validateField(fieldName, value, fieldRules)
      
      if (error) {
        newErrors[fieldName] = error
      }
    })

    setErrors(newErrors)
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [validateField])

  // Validar um campo único e atualizar erros
  const validateSingleField = useCallback((
    _fieldName: string,
    value: string,
    rules: ValidationRules[string]
  ): boolean => {
    const error = validateField(_fieldName, value, rules)
    
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[_fieldName] = error
      } else {
        delete newErrors[_fieldName]
      }
      return newErrors
    })

    return !error
  }, [validateField])

  // Limpar erros
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Limpar erro de um campo específico
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  // Definir erro manualmente
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
  }, [])

  // Regras comuns pré-definidas
  const commonRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      required: true,
      phone: true
    },
    notes: {
      maxLength: 500
    }
  }

  return {
    errors,
    validateFields,
    validateSingleField,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    commonRules,
    isValidEmail,
    isValidPhone,
    isValidBrazilianPhone,
    formatPhone,
    isValidating,
    validateLocal,
    validateWithServer
  }
}
