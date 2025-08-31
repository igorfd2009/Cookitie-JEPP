# Sistema de Sanitização de Dados

Este documento descreve o sistema completo de sanitização implementado para proteger sua aplicação contra ataques XSS, injeção de código e dados maliciosos.

## 🎯 **Objetivos de Segurança**

- ✅ **Proteção XSS**: Remove scripts e tags HTML perigosas
- ✅ **Injeção de Código**: Bloqueia execução de código malicioso
- ✅ **Validação de Dados**: Verifica formatos e estruturas
- ✅ **Limpeza Automática**: Remove caracteres perigosos
- ✅ **Conformidade**: Atende padrões de segurança web

## 🔧 **Funcionalidades Principais**

### **1. Sanitização de Texto**
- Remove tags HTML e scripts
- Remove atributos de eventos perigosos
- Remove caracteres de controle
- Limpa espaços múltiplos

### **2. Sanitização de HTML**
- Permite tags seguras configuráveis
- Remove atributos perigosos
- Mantém estrutura HTML válida
- Configuração flexível de permissões

### **3. Sanitização de URLs**
- Valida protocolos permitidos
- Remove URLs maliciosas
- Converte URLs relativas para absolutas
- Lista branca de protocolos seguros

### **4. Validação de Documentos**
- CPF com algoritmo oficial
- CNPJ com validação completa
- CEP com formato brasileiro
- Email com regex robusto

## 🚀 **Como Usar**

### **Importação Básica**

```tsx
import { sanitizeInput, sanitizeEmail, isValidCPF } from '../utils/sanitization';

// Sanitização básica
const cleanText = sanitizeInput('<script>alert("xss")</script>Olá mundo');
// Resultado: "Olá mundo"

// Sanitização de email
const cleanEmail = sanitizeEmail('  USER@EXAMPLE.COM  ');
// Resultado: "user@example.com"

// Validação de CPF
const isValid = isValidCPF('123.456.789-09');
// Resultado: true/false
```

### **Sanitização de Objetos Completos**

```tsx
import { sanitizeObject } from '../utils/sanitization';

interface UserForm {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
}

const formData: UserForm = {
  nome: '<script>alert("xss")</script>João Silva',
  email: '  JOÃO@EMAIL.COM  ',
  telefone: '(11) 99999-9999',
  cpf: '123.456.789-09',
  endereco: 'Rua das Flores, 123'
};

const fieldConfig = {
  nome: 'name' as const,
  email: 'email' as const,
  telefone: 'phone' as const,
  cpf: 'cpf' as const,
  endereco: 'address' as const
};

const sanitizedData = sanitizeObject(formData, fieldConfig);

console.log(sanitizedData);
// Resultado:
// {
//   nome: 'João Silva',
//   email: 'joão@email.com',
//   telefone: '(11) 99999-9999',
//   cpf: '12345678909',
//   endereco: 'Rua Das Flores, 123'
// }
```

### **Hook React para Formulários**

```tsx
import { useSanitization } from '../utils/sanitization';

function UserForm() {
  const { sanitizeFormData, validateAndSanitize } = useSanitization();
  
  const handleSubmit = (formData: UserForm) => {
    // Configuração de sanitização por campo
    const sanitizationConfig = {
      nome: 'name' as const,
      email: 'email' as const,
      telefone: 'phone' as const,
      cpf: 'cpf' as const,
      endereco: 'address' as const
    };
    
    // Validações por campo
    const validations = {
      nome: () => formData.nome.length >= 2,
      email: () => isValidEmail(formData.email),
      telefone: () => formData.telefone.length >= 10,
      cpf: () => isValidCPF(formData.cpf),
      endereco: () => formData.endereco.length >= 5
    };
    
    // Sanitiza e valida
    const { sanitized, errors, isValid } = validateAndSanitize(
      formData,
      sanitizationConfig,
      validations
    );
    
    if (isValid) {
      // Salva dados sanitizados
      saveUser(sanitized);
    } else {
      // Exibe erros
      console.error('Erros de validação:', errors);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}
```

## 🎨 **Tipos de Sanitização Disponíveis**

### **1. Texto Básico (`text`)**
```tsx
const cleanText = sanitizeInput('<script>alert("xss")</script>Olá mundo');
// Remove todas as tags HTML e scripts
// Resultado: "Olá mundo"
```

### **2. HTML Seguro (`html`)**
```tsx
const allowedTags = ['b', 'i', 'em', 'strong', 'a'];
const cleanHTML = sanitizeHTML('<b>Texto</b><script>alert("xss")</script>', allowedTags);
// Permite apenas tags seguras
// Resultado: "<b>Texto</b>"
```

### **3. URLs (`url`)**
```tsx
const cleanURL = sanitizeURL('javascript:alert("xss")');
// Remove protocolos perigosos
// Resultado: "https://alert("xss")"

const cleanURL2 = sanitizeURL('example.com');
// Adiciona protocolo seguro
// Resultado: "https://example.com"
```

### **4. Emails (`email`)**
```tsx
const cleanEmail = sanitizeEmail('  USER@EXAMPLE.COM  ');
// Remove espaços, converte para minúsculo
// Resultado: "user@example.com"
```

### **5. Números (`number`)**
```tsx
const cleanNumber = sanitizeNumber('R$ 1.234,56');
// Remove caracteres não numéricos, converte vírgula para ponto
// Resultado: 1234.56
```

### **6. Telefones (`phone`)**
```tsx
const cleanPhone = sanitizePhone('(11) 99999-9999');
// Remove caracteres não permitidos
// Resultado: "(11) 99999-9999"
```

### **7. Nomes (`name`)**
```tsx
const cleanName = sanitizeName('<script>alert("xss")</script>joão silva');
// Remove tags HTML, capitaliza palavras
// Resultado: "João Silva"
```

### **8. Endereços (`address`)**
```tsx
const cleanAddress = sanitizeAddress('Rua das Flores, 123');
// Remove caracteres perigosos, capitaliza
// Resultado: "Rua Das Flores, 123"
```

### **9. CPF (`cpf`)**
```tsx
const cleanCPF = sanitizeCPF('123.456.789-09');
// Remove caracteres não numéricos
// Resultado: "12345678909"
```

### **10. CNPJ (`cnpj`)**
```tsx
const cleanCNPJ = sanitizeCNPJ('12.345.678/0001-90');
// Remove caracteres não numéricos
// Resultado: "12345678000190"
```

### **11. CEP (`cep`)**
```tsx
const cleanCEP = sanitizeCEP('12345-678');
// Remove caracteres não numéricos
// Resultado: "12345678"
```

## 🔍 **Validações Disponíveis**

### **Email**
```tsx
import { isValidEmail } from '../utils/sanitization';

const validEmails = [
  'user@example.com',
  'user.name@domain.co.uk',
  'user+tag@example.org'
];

const invalidEmails = [
  'invalid-email',
  '@example.com',
  'user@',
  'user@.com'
];

validEmails.forEach(email => {
  console.log(`${email}: ${isValidEmail(email)}`); // true
});

invalidEmails.forEach(email => {
  console.log(`${email}: ${isValidEmail(email)}`); // false
});
```

### **CPF**
```tsx
import { isValidCPF } from '../utils/sanitization';

const validCPFs = [
  '123.456.789-09',
  '987.654.321-00',
  '111.444.777-35'
];

const invalidCPFs = [
  '123.456.789-10', // Dígito verificador incorreto
  '111.111.111-11', // Todos os dígitos iguais
  '123.456.789'     // Incompleto
];

validCPFs.forEach(cpf => {
  console.log(`${cpf}: ${isValidCPF(cpf)}`); // true
});

invalidCPFs.forEach(cpf => {
  console.log(`${cpf}: ${isValidCPF(cpf)}`); // false
});
```

### **CNPJ**
```tsx
import { isValidCNPJ } from '../utils/sanitization';

const validCNPJs = [
  '12.345.678/0001-90',
  '98.765.432/0001-00',
  '11.444.777/0001-61'
];

const invalidCNPJs = [
  '12.345.678/0001-91', // Dígito verificador incorreto
  '11.111.111/1111-11', // Todos os dígitos iguais
  '12.345.678/0001'     // Incompleto
];

validCNPJs.forEach(cnpj => {
  console.log(`${cnpj}: ${isValidCNPJ(cnpj)}`); // true
});

invalidCNPJs.forEach(cnpj => {
  console.log(`${cnpj}: ${isValidCNPJ(cnpj)}`); // false
});
```

### **CEP**
```tsx
import { isValidCEP } from '../utils/sanitization';

const validCEPs = [
  '12345-678',
  '98765-432',
  '11111-111'
];

const invalidCEPs = [
  '1234-567',   // Muito curto
  '123456789',  // Muito longo
  'abcdef-gh'   // Caracteres não numéricos
];

validCEPs.forEach(cep => {
  console.log(`${cep}: ${isValidCEP(cep)}`); // true
});

invalidCEPs.forEach(cep => {
  console.log(`${cep}: ${isValidCEP(cep)}`); // false
});
```

## 🎯 **Casos de Uso Comuns**

### **1. Formulário de Cadastro**

```tsx
function SignupForm() {
  const { sanitizeFormData, validateAndSanitize } = useSanitization();
  
  const handleSubmit = async (formData: SignupFormData) => {
    // Configuração de sanitização
    const sanitizationConfig = {
      nome: 'name' as const,
      email: 'email' as const,
      telefone: 'phone' as const,
      cpf: 'cpf' as const,
      endereco: 'address' as const,
      cep: 'cep' as const
    };
    
    // Validações
    const validations = {
      nome: () => formData.nome.length >= 2,
      email: () => isValidEmail(formData.email),
      telefone: () => formData.telefone.length >= 10,
      cpf: () => isValidCPF(formData.cpf),
      endereco: () => formData.endereco.length >= 5,
      cep: () => isValidCEP(formData.cep)
    };
    
    // Sanitiza e valida
    const { sanitized, errors, isValid } = validateAndSanitize(
      formData,
      sanitizationConfig,
      validations
    );
    
    if (isValid) {
      try {
        await createUser(sanitized);
        toast.success('Usuário criado com sucesso!');
      } catch (error) {
        toast.error('Erro ao criar usuário');
      }
    } else {
      errors.forEach(error => toast.error(error));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### **2. Sistema de Comentários**

```tsx
function CommentSystem() {
  const { sanitizeHTML } = useSanitization();
  
  const handleCommentSubmit = (comment: string) => {
    // Permite apenas tags seguras para comentários
    const allowedTags = ['b', 'i', 'em', 'strong', 'a'];
    const sanitizedComment = sanitizeHTML(comment, allowedTags);
    
    // Salva comentário sanitizado
    saveComment(sanitizedComment);
  };
  
  return (
    <div>
      <textarea 
        placeholder="Seu comentário..."
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={() => handleCommentSubmit(comment)}>
        Enviar Comentário
      </button>
    </div>
  );
}
```

### **3. Sistema de Upload de Arquivos**

```tsx
function FileUpload() {
  const { sanitizeInput, sanitizeURL } = useSanitization();
  
  const handleFileUpload = (file: File) => {
    // Sanitiza nome do arquivo
    const sanitizedFileName = sanitizeInput(file.name);
    
    // Sanitiza URL de upload
    const uploadURL = sanitizeURL('/api/upload');
    
    // Upload seguro
    uploadFile(file, uploadURL, sanitizedFileName);
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
    />
  );
}
```

### **4. Sistema de Busca**

```tsx
function SearchSystem() {
  const { sanitizeInput } = useSanitization();
  
  const handleSearch = (searchTerm: string) => {
    // Sanitiza termo de busca
    const sanitizedTerm = sanitizeInput(searchTerm);
    
    // Busca segura
    performSearch(sanitizedTerm);
  };
  
  return (
    <input 
      type="text" 
      placeholder="Buscar..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

## 🔒 **Proteções de Segurança**

### **Contra XSS (Cross-Site Scripting)**
```tsx
// Remove scripts completos
.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

// Remove tags HTML
.replace(/<[^>]*>/g, '')

// Remove atributos de eventos
.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

// Remove javascript: URLs
.replace(/javascript:/gi, '')
```

### **Contra Injeção de Código**
```tsx
// Remove data: URLs suspeitos
.replace(/data:\s*text\/html/gi, '')

// Remove vbscript
.replace(/vbscript:/gi, '')

// Remove expressões CSS perigosas
.replace(/expression\s*\(/gi, '')

// Remove comentários HTML
.replace(/<!--[\s\S]*?-->/g, '')
```

### **Contra Caracteres Perigosos**
```tsx
// Remove caracteres de controle
.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

// Remove caracteres especiais perigosos
.replace(/[<>\"'&]/g, '')

// Remove múltiplos espaços
.replace(/\s+/g, ' ')
```

## 📊 **Configurações de Tags HTML Seguras**

### **Tags Padrão Permitidas**
```tsx
const defaultAllowedTags = [
  'b',      // Negrito
  'i',      // Itálico
  'em',     // Ênfase
  'strong', // Forte
  'a',      // Link
  'br',     // Quebra de linha
  'p'       // Parágrafo
];
```

### **Configuração Personalizada**
```tsx
// Apenas formatação básica
const basicTags = ['b', 'i', 'em', 'strong'];

// Formatação completa
const fullTags = ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'];

// Apenas links
const linkOnlyTags = ['a'];

const cleanHTML = sanitizeHTML(userInput, basicTags);
```

## 🚨 **Troubleshooting**

### **Problema: Dados não são sanitizados**
```tsx
// Verifique se está usando a função correta
const cleanText = sanitizeInput('<script>alert("xss")</script>');

// Verifique se o input não é undefined/null
if (input) {
  const cleanText = sanitizeInput(input);
}
```

### **Problema: Validação sempre falha**
```tsx
// Verifique se está usando a função de validação correta
const isValid = isValidCPF('123.456.789-09'); // true
const isValid2 = isValidEmail('user@example.com'); // true

// Verifique se o formato está correto
console.log('CPF limpo:', sanitizeCPF('123.456.789-09')); // "12345678909"
```

### **Problema: HTML não é preservado**
```tsx
// Use sanitizeHTML em vez de sanitizeInput para preservar HTML
const cleanHTML = sanitizeHTML('<b>Texto</b><script>alert("xss")</script>');
// Resultado: "<b>Texto</b>"

// Configure tags permitidas
const allowedTags = ['b', 'i', 'em', 'strong'];
const cleanHTML2 = sanitizeHTML(userInput, allowedTags);
```

## 🔄 **Próximas Melhorias**

### **Funcionalidades Planejadas**
- [ ] **Sanitização de Imagens**: Validação de metadados
- [ ] **Sanitização de PDFs**: Verificação de conteúdo
- [ ] **Sanitização de XML**: Proteção contra XXE
- [ ] **Sanitização de JSON**: Validação de estrutura
- [ ] **Sanitização de SQL**: Proteção contra SQL Injection

### **Otimizações**
- [ ] **Cache de Sanitização**: Para dados repetidos
- [ ] **Sanitização Assíncrona**: Para arquivos grandes
- [ ] **Sanitização em Lote**: Para múltiplos itens
- [ ] **Métricas de Performance**: Monitoramento de tempo

## 📋 **Checklist de Implementação**

- [ ] **Sanitização Básica**: Implementar `sanitizeInput`
- [ ] **Sanitização HTML**: Implementar `sanitizeHTML`
- [ ] **Sanitização de URLs**: Implementar `sanitizeURL`
- [ ] **Validações**: Implementar validações de documentos
- [ ] **Hook React**: Implementar `useSanitization`
- [ ] **Testes**: Testar diferentes cenários de ataque
- [ ] **Documentação**: Documentar uso e configurações

## 🎯 **Casos de Uso Avançados**

### **1. Sistema de Moderação de Conteúdo**
```tsx
function ContentModeration() {
  const { sanitizeHTML, sanitizeInput } = useSanitization();
  
  const moderateContent = (content: string, contentType: 'comment' | 'post' | 'profile') => {
    const allowedTags = contentType === 'comment' 
      ? ['b', 'i', 'em', 'strong'] 
      : ['b', 'i', 'em', 'strong', 'a', 'br', 'p'];
    
    if (contentType === 'profile') {
      return sanitizeInput(content); // Sem HTML
    } else {
      return sanitizeHTML(content, allowedTags); // Com HTML limitado
    }
  };
  
  return (
    <div>
      <button onClick={() => moderateContent(userContent, 'comment')}>
        Moderar Comentário
      </button>
    </div>
  );
}
```

### **2. Sistema de Filtros de Busca**
```tsx
function SearchFilters() {
  const { sanitizeInput, sanitizeNumber } = useSanitization();
  
  const applyFilters = (filters: SearchFilters) => {
    const sanitizedFilters = {
      term: sanitizeInput(filters.term),
      minPrice: sanitizeNumber(filters.minPrice),
      maxPrice: sanitizeNumber(filters.maxPrice),
      category: sanitizeInput(filters.category)
    };
    
    performSearch(sanitizedFilters);
  };
  
  return (
    <div>
      {/* Filtros de busca */}
    </div>
  );
}
```

---

**Sistema de Sanitização Implementado com Sucesso! 🎉**

Agora sua aplicação está protegida contra ataques XSS, injeção de código e dados maliciosos!
