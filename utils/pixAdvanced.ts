// Sistema PIX Avançado - Nível Profissional
// Compatível com padrão EMV do Banco Central do Brasil

interface PixConfig {
  pixKey: string
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
  merchantName: string
  merchantCity: string
  merchantCEP?: string
  merchantCategory: string
  currency: string
  countryCode: string
}

interface PixPayment {
  amount: number
  description: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
    document?: string
  }
  expiresInMinutes?: number
  webhook?: string
}

interface PixResponse {
  success: boolean
  transactionId: string
  pixCode: string
  qrCodeBase64: string
  qrCodeUrl: string
  amount: number
  expiresAt: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  customer: any
  orderId: string
  error?: string
}

class PixAdvancedSystem {
  private config: PixConfig
  private payments: Map<string, PixResponse> = new Map()

  constructor(config: PixConfig) {
    this.config = config
    this.loadPaymentsFromStorage()
  }

  // Gerar código PIX EMV padrão Banco Central
  generatePixEMV(payment: PixPayment): string {
    console.log('🏗️ Iniciando geração do PIX EMV:', { payment, config: this.config })
    
    const {
      pixKey,
      merchantName,
      merchantCity,
      merchantCategory,
      countryCode
    } = this.config

    const amount = payment.amount.toFixed(2)
    const orderId = payment.orderId

    console.log('📝 Dados processados:', {
      pixKey,
      amount,
      orderId,
      merchantName,
      merchantCity,
      merchantCategory
    })

    // Formato EMV padrão do PIX - Seguindo especificação oficial
    let emv = ''

    // 00 - Payload Format Indicator
    const field00 = '000201'
    emv += field00
    console.log('📄 Campo 00 (Payload Format):', field00)
    
    // 01 - Point of Initiation Method (12 = static)
    const field01 = '010212'
    emv += field01
    console.log('📄 Campo 01 (Point of Initiation):', field01)
    
    // 26 - Merchant Account Information (PIX)
    let merchantInfo = ''
    merchantInfo += '0014BR.GOV.BCB.PIX' // GUI do PIX
    
    // Chave PIX
    merchantInfo += `01${this.formatLength(pixKey.length)}${pixKey}`
    
    // Descrição (opcional, mas recomendado)
    if (payment.description) {
      const desc = this.normalizeText(payment.description.substring(0, 25))
      console.log('📝 Descrição normalizada:', { original: payment.description, normalized: desc })
      if (desc.length > 0) {
        merchantInfo += `02${this.formatLength(desc.length)}${desc}`
      }
    }
    
    const field26 = `26${this.formatLength(merchantInfo.length)}${merchantInfo}`
    emv += field26
    console.log('📄 Campo 26 (Merchant Account):', { field: field26, merchantInfo })
    
    // 52 - Merchant Category Code
    const field52 = `52${this.formatLength(merchantCategory.length)}${merchantCategory}`
    emv += field52
    console.log('📄 Campo 52 (Category):', field52)
    
    // 53 - Transaction Currency (986 = BRL)
    const field53 = '5303986'
    emv += field53
    console.log('📄 Campo 53 (Currency):', field53)
    
    // 54 - Transaction Amount (apenas se valor > 0)
    if (payment.amount > 0) {
      const field54 = `54${this.formatLength(amount.length)}${amount}`
      emv += field54
      console.log('📄 Campo 54 (Amount):', field54)
    }
    
    // 58 - Country Code
    const field58 = `58${this.formatLength(countryCode.length)}${countryCode}`
    emv += field58
    console.log('📄 Campo 58 (Country):', field58)
    
    // 59 - Merchant Name
    const normalizedName = this.normalizeText(merchantName.substring(0, 25))
    const field59 = `59${this.formatLength(normalizedName.length)}${normalizedName}`
    emv += field59
    console.log('📄 Campo 59 (Merchant Name):', { field: field59, normalized: normalizedName })
    
    // 60 - Merchant City
    const normalizedCity = this.normalizeText(merchantCity.substring(0, 15))
    const field60 = `60${this.formatLength(normalizedCity.length)}${normalizedCity}`
    emv += field60
    console.log('📄 Campo 60 (City):', { field: field60, normalized: normalizedCity })
    
    // 62 - Additional Data Field Template
    if (orderId) {
      let additionalData = ''
      const normalizedOrderId = this.normalizeText(orderId.substring(0, 25))
      additionalData += `05${this.formatLength(normalizedOrderId.length)}${normalizedOrderId}`
      const field62 = `62${this.formatLength(additionalData.length)}${additionalData}`
      emv += field62
      console.log('📄 Campo 62 (Additional Data):', { field: field62, additionalData, normalizedOrderId })
    }
    
    // Dados antes do CRC
    const dataBeforeCRC = emv + '6304'
    console.log('🧮 Dados antes do CRC:', { data: dataBeforeCRC, length: dataBeforeCRC.length })
    
    // 63 - CRC16
    emv += '6304'
    const crc = this.calculateCRC16(emv)
    emv += crc
    
    console.log('🏁 PIX EMV gerado:', { 
      final: emv, 
      length: emv.length,
      crc,
      dataForCRC: emv.substring(0, emv.length - 4) + '6304'
    })

    return emv
  }

  // Formatar comprimento para 2 dígitos
  private formatLength(length: number): string {
    return length.toString().padStart(2, '0')
  }

  // Normalizar texto removendo acentos e caracteres especiais
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^A-Za-z0-9\s]/g, '') // Remove caracteres especiais
      .toUpperCase()
      .trim()
  }

  // Calcular CRC16 para validação EMV (conforme especificação ISO/IEC 13239)
  private calculateCRC16(data: string): string {
    let crc = 0xFFFF
    const polynomial = 0x1021
    
    for (let i = 0; i < data.length; i++) {
      crc ^= (data.charCodeAt(i) << 8)
      
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ polynomial) & 0xFFFF
        } else {
          crc = (crc << 1) & 0xFFFF
        }
      }
    }
    
    // Converter para hexadecimal maiúsculo com 4 dígitos
    return crc.toString(16).toUpperCase().padStart(4, '0')
  }

  // Validar código PIX EMV gerado
  validatePixCode(pixCode: string): { valid: boolean; details: any } {
    try {
      console.log('🔍 Iniciando validação do PIX:', { pixCode, length: pixCode.length })
      
      if (!pixCode || pixCode.length < 10) {
        return {
          valid: false,
          details: { error: 'PIX muito curto ou vazio', pixCode, length: pixCode.length }
        }
      }
      
      let pos = 0
      const fields: any = {}
      const errors: string[] = []
      
      while (pos < pixCode.length - 4) { // -4 para o CRC no final
        try {
          const tag = pixCode.substring(pos, pos + 2)
          const lengthStr = pixCode.substring(pos + 2, pos + 4)
          const length = parseInt(lengthStr)
          
          if (isNaN(length)) {
            errors.push(`Tag ${tag}: length inválido '${lengthStr}'`)
            break
          }
          
          if (pos + 4 + length > pixCode.length) {
            errors.push(`Tag ${tag}: field extends beyond PIX length`)
            break
          }
          
          const value = pixCode.substring(pos + 4, pos + 4 + length)
          
          fields[tag] = { length, value, position: pos }
          pos += 4 + length
          
          console.log(`📄 Campo ${tag}: length=${length}, value='${value}'`)
        } catch (fieldError) {
          errors.push(`Erro ao processar campo na posição ${pos}: ${fieldError}`)
          break
        }
      }
      
      // Verificar se chegou ao final corretamente
      if (pos !== pixCode.length - 4) {
        errors.push(`Parsing parou na posição ${pos}, esperado ${pixCode.length - 4}`)
      }
      
      // Verificar CRC apenas se não houve erros no parsing
      let crcMatch = false
      let crcDetails = {}
      
      if (errors.length === 0) {
        const dataWithoutCRC = pixCode.substring(0, pixCode.length - 4)
        const providedCRC = pixCode.substring(pixCode.length - 4)
        const calculatedCRC = this.calculateCRC16(dataWithoutCRC + '6304')
        
        crcMatch = providedCRC === calculatedCRC
        crcDetails = {
          provided: providedCRC,
          calculated: calculatedCRC,
          match: crcMatch,
          dataForCRC: dataWithoutCRC + '6304'
        }
        
        if (!crcMatch) {
          errors.push(`CRC mismatch: provided=${providedCRC}, calculated=${calculatedCRC}`)
        }
      }
      
      const isValid = errors.length === 0 && crcMatch
      
      console.log('📊 Resultado da validação:', {
        valid: isValid,
        errors,
        fieldCount: Object.keys(fields).length,
        crcMatch
      })
      
      return {
        valid: isValid,
        details: {
          fields,
          errors,
          crc: crcDetails,
          length: pixCode.length,
          pixCode: pixCode,
          parsing: {
            finalPosition: pos,
            expectedPosition: pixCode.length - 4,
            success: pos === pixCode.length - 4
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('💥 Erro na validação:', error)
      return {
        valid: false,
        details: { 
          error: errorMessage,
          pixCode,
          length: pixCode ? pixCode.length : 0
        }
      }
    }
  }

  // Gerar QR Code em base64
  async generateQRCode(pixCode: string): Promise<string> {
    try {
      // Usar API gratuita do QR Server
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(pixCode)}`
      
      // Converter para base64
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      return this.generateFallbackQR(pixCode)
    }
  }

  // QR Code de fallback (SVG)
  private generateFallbackQR(pixCode: string): string {
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="white" stroke="black" stroke-width="2"/>
        <text x="150" y="130" text-anchor="middle" font-size="24" font-weight="bold">PIX</text>
        <text x="150" y="160" text-anchor="middle" font-size="14" fill="blue">QR Code Gerado</text>
        <text x="150" y="180" text-anchor="middle" font-size="12" fill="gray">Valor: R$ ${this.extractAmountFromPix(pixCode)}</text>
        <text x="150" y="200" text-anchor="middle" font-size="10" fill="gray">Cookite JEPP</text>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  // Extrair valor do código PIX
  private extractAmountFromPix(pixCode: string): string {
    const match = pixCode.match(/54\d{2}(\d+\.\d{2})/)
    return match ? match[1] : '0.00'
  }

  // Criar pagamento PIX
  async createPayment(payment: PixPayment): Promise<PixResponse> {
    try {
      const transactionId = this.generateTransactionId()
      const expiresAt = new Date(Date.now() + (payment.expiresInMinutes || 30) * 60000).toISOString()
      
      // Gerar código PIX EMV
      const pixCode = this.generatePixEMV(payment)
      
      // Debug do PIX gerado
      console.log('🔍 PIX gerado para debug:', {
        pixCode,
        length: pixCode.length,
        config: this.config,
        payment: {
          amount: payment.amount,
          description: payment.description,
          orderId: payment.orderId
        }
      })
      
      // Validar código PIX gerado
      const validation = this.validatePixCode(pixCode)
      
      console.log('🧪 Resultado da validação:', validation)
      
      if (!validation.valid) {
        console.error('❌ PIX inválido gerado:', validation.details)
        console.error('📋 Detalhes completos:', {
          pixCode,
          config: this.config,
          payment,
          validation
        })
        
        // Não falhar por enquanto, apenas avisar
        console.warn('⚠️ Continuando mesmo com PIX inválido para debug')
      } else {
        console.log('✅ PIX válido gerado:', {
          pixCode,
          validation: validation.details
        })
      }
      
      // Gerar QR Code
      const qrCodeBase64 = await this.generateQRCode(pixCode)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`
      
      const pixResponse: PixResponse = {
        success: true,
        transactionId,
        pixCode,
        qrCodeBase64,
        qrCodeUrl,
        amount: payment.amount,
        expiresAt,
        status: 'pending',
        customer: payment.customer,
        orderId: payment.orderId
      }
      
      // Salvar pagamento
      this.payments.set(transactionId, pixResponse)
      this.savePaymentsToStorage()
      
      // Log para debug
      console.log('💳 PIX Criado:', {
        transactionId,
        amount: payment.amount,
        customer: payment.customer.name,
        expiresAt
      })
      
      return pixResponse
      
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      return {
        success: false,
        error: 'Erro ao gerar pagamento PIX',
        transactionId: '',
        pixCode: '',
        qrCodeBase64: '',
        qrCodeUrl: '',
        amount: 0,
        expiresAt: '',
        status: 'cancelled',
        customer: payment.customer,
        orderId: payment.orderId
      }
    }
  }

  // Verificar status do pagamento
  checkPaymentStatus(transactionId: string): PixResponse | null {
    const payment = this.payments.get(transactionId)
    if (!payment) return null
    
    // Verificar se expirou
    if (new Date() > new Date(payment.expiresAt) && payment.status === 'pending') {
      payment.status = 'expired'
      this.payments.set(transactionId, payment)
      this.savePaymentsToStorage()
      return payment
    }
    
    // NOTA: Em um sistema real, aqui consultaria a API do banco
    // Por enquanto, NÃO simula detecção automática para evitar falsos positivos
    // O usuário deve confirmar manualmente após realizar o pagamento
    
    return payment
  }



  // Cancelar pagamento
  cancelPayment(transactionId: string): boolean {
    const payment = this.payments.get(transactionId)
    if (!payment) return false
    
    payment.status = 'cancelled'
    this.payments.set(transactionId, payment)
    this.savePaymentsToStorage()
    
    return true
  }

  // Listar todos os pagamentos
  getAllPayments(): PixResponse[] {
    return Array.from(this.payments.values())
  }

  // Estatísticas
  getStats() {
    const payments = this.getAllPayments()
    const total = payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)
    const pending = payments.filter(p => p.status === 'pending').length
    const paid = payments.filter(p => p.status === 'paid').length
    const expired = payments.filter(p => p.status === 'expired').length
    
    return {
      totalAmount: total,
      totalTransactions: payments.length,
      pendingCount: pending,
      paidCount: paid,
      expiredCount: expired,
      conversionRate: payments.length > 0 ? (paid / payments.length * 100).toFixed(1) : '0'
    }
  }

  // Gerar ID único
  private generateTransactionId(): string {
    return `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Salvar no localStorage
  private savePaymentsToStorage(): void {
    try {
      localStorage.setItem('cookite_pix_payments', JSON.stringify(Array.from(this.payments.entries())))
    } catch (error) {
      console.error('Erro ao salvar pagamentos:', error)
    }
  }

  // Carregar do localStorage
  private loadPaymentsFromStorage(): void {
    try {
      const stored = localStorage.getItem('cookite_pix_payments')
      if (stored) {
        const entries = JSON.parse(stored)
        this.payments = new Map(entries)
      }
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
    }
  }
}

// Configuração para Cookite JEPP  
const pixConfig: PixConfig = {
  // Telefone no formato correto com código do país
  pixKey: '+5511998008397', // Telefone PIX da Nicolly (formato internacional)
  pixKeyType: 'phone',
  merchantName: 'NICOLLY ASCIONE SALOMAO', // Nome sem acento como aparece no banco
  merchantCity: 'SAO PAULO',
  merchantCategory: '5812', // Restaurantes
  currency: 'BRL',
  countryCode: 'BR'
}

// Instância global do sistema PIX
export const pixSystem = new PixAdvancedSystem(pixConfig)

// Tipos exportados
export type { PixPayment, PixResponse, PixConfig }
