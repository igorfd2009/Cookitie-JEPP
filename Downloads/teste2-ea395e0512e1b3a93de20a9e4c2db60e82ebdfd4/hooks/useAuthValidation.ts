import { useState, useCallback } from 'react'

interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface ValidationErrors {
  [key: string]: string
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

export const useAuthValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Validação de email
  const validateEmail = useCallback((email: string): string | null => {
    if (!email) return 'Email é obrigatório'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Email inválido'
    }
    
    if (email.length > 254) {
      return 'Email muito longo'
    }
    
    return null
  }, [])

  // Validação de senha
  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'Senha é obrigatória'
    
    if (password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (password.length > 128) {
      return 'Senha muito longa'
    }
    
    // Verificar se contém pelo menos uma letra e um número
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    if (!hasLetter || !hasNumber) {
      return 'Senha deve conter letras e números'
    }
    
    return null
  }, [])

  // Validação de confirmação de senha
  const validateConfirmPassword = useCallback((password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Confirmação de senha é obrigatória'
    
    if (password !== confirmPassword) {
      return 'As senhas não coincidem'
    }
    
    return null
  }, [])

  // Validação de nome completo
  const validateFullName = useCallback((fullName: string): string | null => {
    if (!fullName) return 'Nome completo é obrigatório'
    
    if (fullName.length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres'
    }
    
    if (fullName.length > 100) {
      return 'Nome muito longo'
    }
    
    // Verificar se contém pelo menos duas palavras
    const words = fullName.trim().split(/\s+/)
    if (words.length < 2) {
      return 'Digite seu nome completo (nome e sobrenome)'
    }
    
    // Verificar se cada palavra tem pelo menos 2 caracteres
    for (const word of words) {
      if (word.length < 2) {
        return 'Cada parte do nome deve ter pelo menos 2 caracteres'
      }
    }
    
    return null
  }, [])

  // Validação de telefone
  const validatePhone = useCallback((phone: string): string | null => {
    if (!phone) return null // Telefone é opcional
    
    // Remover todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length < 10) {
      return 'Telefone deve ter pelo menos 10 dígitos'
    }
    
    if (cleanPhone.length > 11) {
      return 'Telefone deve ter no máximo 11 dígitos'
    }
    
    // Verificar se começa com DDD válido (11-99)
    const ddd = parseInt(cleanPhone.substring(0, 2))
    if (ddd < 11 || ddd > 99) {
      return 'DDD inválido'
    }
    
    return null
  }, [])

  // Validação genérica de campo
  const validateField = useCallback((value: string, rules: ValidationRules, fieldName: string): string | null => {
    // Validação obrigatória
    if (rules.required && !value) {
      return `${fieldName} é obrigatório`
    }
    
    if (!value) return null // Se não é obrigatório e está vazio, é válido
    
    // Validação de comprimento mínimo
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} deve ter pelo menos ${rules.minLength} caracteres`
    }
    
    // Validação de comprimento máximo
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} deve ter no máximo ${rules.maxLength} caracteres`
    }
    
    // Validação de padrão
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} não está no formato correto`
    }
    
    // Validação customizada
    if (rules.custom) {
      return rules.custom(value)
    }
    
    return null
  }, [])

  // Validação completa do formulário de login
  const validateLoginForm = useCallback((email: string, password: string): ValidationResult => {
    const newErrors: ValidationErrors = {}
    
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    
    setErrors(newErrors)
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [validateEmail, validatePassword])

  // Validação completa do formulário de cadastro
  const validateSignupForm = useCallback((
    email: string, 
    password: string, 
    confirmPassword: string, 
    fullName: string, 
    phone: string
  ): ValidationResult => {
    const newErrors: ValidationErrors = {}
    
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    
    const fullNameError = validateFullName(fullName)
    if (fullNameError) newErrors.fullName = fullNameError
    
    const phoneError = validatePhone(phone)
    if (phoneError) newErrors.phone = phoneError
    
    setErrors(newErrors)
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [validateEmail, validatePassword, validateConfirmPassword, validateFullName, validatePhone])

  // Validação de perfil
  const validateProfileForm = useCallback((fullName: string, phone: string): ValidationResult => {
    const newErrors: ValidationErrors = {}
    
    const fullNameError = validateFullName(fullName)
    if (fullNameError) newErrors.fullName = fullNameError
    
    const phoneError = validatePhone(phone)
    if (phoneError) newErrors.phone = phoneError
    
    setErrors(newErrors)
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [validateFullName, validatePhone])

  // Limpar erros
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Limpar erro específico
  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  // Verificar se um campo específico tem erro
  const hasError = useCallback((fieldName: string): boolean => {
    return !!errors[fieldName]
  }, [errors])

  // Obter erro de um campo específico
  const getError = useCallback((fieldName: string): string | null => {
    return errors[fieldName] || null
  }, [errors])

  return {
    errors,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateFullName,
    validatePhone,
    validateField,
    validateLoginForm,
    validateSignupForm,
    validateProfileForm,
    clearErrors,
    clearError,
    hasError,
    getError
  }
}
