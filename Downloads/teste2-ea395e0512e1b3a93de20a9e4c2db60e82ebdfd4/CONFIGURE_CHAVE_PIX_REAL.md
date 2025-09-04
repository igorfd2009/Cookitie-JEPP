# 🔑 CONFIGURAR CHAVE PIX REAL

## 🚨 **PROBLEMA IDENTIFICADO:**
```
"Erro na leitura do codigo (chave inexistente. Nao foi possivel encontrar essa conta.)"
```

**✅ CAUSA:** A chave PIX `42151999807` não existe ou não está cadastrada no sistema PIX.

## 🔧 **SOLUÇÃO:**

### **1. CONFIGURAR CHAVE PIX REAL:**

#### **Opção A - Usar sua chave PIX pessoal:**
```typescript
// No arquivo utils/pixAdvanced.ts, linha ~547
const pixConfig: PixConfig = {
  pixKey: 'SEU_EMAIL@gmail.com',        // Substitua pelo seu email PIX
  pixKeyType: 'email',
  merchantName: 'SEU NOME',             // Substitua pelo seu nome
  merchantCity: 'SUA CIDADE',           // Substitua pela sua cidade
  merchantCategory: '5812',
  currency: 'BRL',
  countryCode: 'BR'
}
```

#### **Opção B - Usar seu CPF:**
```typescript
const pixConfig: PixConfig = {
  pixKey: '12345678901',                // Substitua pelo seu CPF (só números)
  pixKeyType: 'cpf',
  merchantName: 'SEU NOME',
  merchantCity: 'SUA CIDADE',
  merchantCategory: '5812',
  currency: 'BRL',
  countryCode: 'BR'
}
```

#### **Opção C - Usar chave aleatória:**
```typescript
const pixConfig: PixConfig = {
  pixKey: 'sua-chave-aleatoria-aqui',   // Chave gerada pelo banco
  pixKeyType: 'random',
  merchantName: 'SEU NOME',
  merchantCity: 'SUA CIDADE',
  merchantCategory: '5812',
  currency: 'BRL',
  countryCode: 'BR'
}
```

### **2. COMO OBTER SUA CHAVE PIX:**

#### **📱 Pelo App do Banco:**
1. **Abra o app** do seu banco
2. **Vá em PIX** → **Minhas Chaves**
3. **Copie uma chave** existente ou **crie uma nova**
4. **Tipos disponíveis:**
   - **📧 Email** (mais fácil de lembrar)
   - **📱 Telefone** (formato: +5511999999999)
   - **🆔 CPF** (só números)
   - **🎲 Aleatória** (código gerado pelo banco)

#### **🏪 Para Estabelecimento Comercial:**
1. **Use CNPJ** se tiver empresa
2. **Use chave comercial** específica
3. **Configure nome fantasia** como merchantName

### **3. EDITAR A CONFIGURAÇÃO:**

#### **📝 Passos:**
1. **Abra o arquivo:** `utils/pixAdvanced.ts`
2. **Procure pela linha ~547:** `const pixConfig: PixConfig = {`
3. **Substitua os dados:**
   ```typescript
   const pixConfig: PixConfig = {
     pixKey: 'SUA_CHAVE_PIX_AQUI',      // ← EDITE AQUI
     pixKeyType: 'email', // ou 'cpf', 'phone', 'random', 'cnpj'
     merchantName: 'SEU NOME COMPLETO', // ← EDITE AQUI
     merchantCity: 'SUA CIDADE',        // ← EDITE AQUI
     merchantCategory: '5812',          // Mantém (Restaurantes)
     currency: 'BRL',
     countryCode: 'BR'
   }
   ```
4. **Salve o arquivo**

### **4. EXEMPLO REAL:**
```typescript
const pixConfig: PixConfig = {
  pixKey: 'joao.silva@gmail.com',       // Email PIX real
  pixKeyType: 'email',
  merchantName: 'JOAO SILVA',           // Nome do proprietário
  merchantCity: 'SAO PAULO',
  merchantCategory: '5812',
  currency: 'BRL',
  countryCode: 'BR'
}
```

### **5. TESTAR NOVAMENTE:**

#### **Após configurar:**
1. **Salve as alterações**
2. **Recarregue a página** (Ctrl+F5)
3. **Faça novo checkout**
4. **Teste o PIX** com app bancário
5. **✅ DEVE FUNCIONAR** agora!

## 🎯 **DICAS IMPORTANTES:**

### **⚠️ Segurança:**
- **NÃO compartilhe** chaves PIX pessoais
- **Use conta de teste** se for apenas demonstração
- **Configure conta comercial** se for uso real

### **🔄 Para Teste:**
- **Crie conta bancária** específica para testes
- **Use valores baixos** (R$ 0,01) para testar
- **Confirme recebimento** antes de usar em produção

### **📱 Validação:**
- **Teste com diferentes bancos** (Nubank, Inter, Itaú, etc.)
- **Verifique se chave** está ativa no seu banco
- **Confirme dados** do beneficiário no app

## 🚀 **RESULTADO ESPERADO:**

### **✅ Com chave PIX válida:**
```
"PIX de R$ 1,50 para JOAO SILVA"
"Confirmar pagamento?"
```

### **❌ Com chave inválida:**
```
"Erro na leitura do codigo (chave inexistente)"
```

---

**📝 PRÓXIMOS PASSOS:**
1. **✅ Configure sua chave PIX real**
2. **✅ Teste o QR Code**
3. **✅ Confirme recebimento**
4. **✅ Use em produção**

**🎉 Depois disso, seu sistema PIX estará 100% funcional! 💳**
