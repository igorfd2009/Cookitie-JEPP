# 🚀 Guia de Deploy no Netlify - Cookite JEPP

## ✅ **Problema Resolvido**

O erro de build foi causado porque o Netlify estava tentando executar um script `deploy:build` que não existia no `package.json`.

## 🔧 **Soluções Implementadas**

### 1. **Script de Build Adicionado**
```json
"deploy:build": "tsc && vite build"
```

### 2. **Arquivo de Configuração Netlify**
Criado `netlify.toml` com configurações otimizadas.

### 3. **Versão do Node.js**
Criado `.nvmrc` especificando Node.js 18.

## 📋 **Configurações do Netlify**

### **Build Settings:**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18
- **NPM version:** 9

### **Environment Variables (OBRIGATÓRIAS):**
```env
VITE_SUPABASE_URL=https://deeichvgibhpbrowhaiq.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui
VITE_RESEND_API_KEY=re_123456789...sua_chave_api_resend_aqui
```

### **Environment Variables (OPCIONAIS):**
```env
VITE_APP_NAME=Cookite JEPP
VITE_SITE_URL=https://seu-dominio.netlify.app
VITE_PIX_KEY_TYPE=phone
VITE_PIX_KEY_VALUE=+5511998008397
VITE_MERCHANT_NAME=NICOLLY ASCIONE SALAMO
VITE_MERCHANT_CITY=SAO PAULO
```

## 🚀 **Passos para Deploy**

### **1. Configurar no Netlify:**
- Site Settings → Build & Deploy → Build Settings
- Build command: `npm run build`
- Publish directory: `dist`

### **2. Configurar Environment Variables:**
- Site Settings → Environment Variables
- Adicione todas as variáveis VITE_ necessárias

### **3. Configurar Domain:**
- Site Settings → Domain Management
- Configure seu domínio personalizado

## 🔍 **Verificação Pós-Deploy**

Após o deploy bem-sucedido, verifique:

1. ✅ **Site carrega** sem erros no console
2. ✅ **Autenticação** está funcionando
3. ✅ **Emails** estão sendo enviados
4. ✅ **Pagamentos PIX** estão funcionando
5. ✅ **Banco de dados** está sincronizando

## 🚨 **Troubleshooting**

### **Erro: "Build failed"**
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se o script `build` está funcionando localmente

### **Erro: "Supabase not configured"**
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos

### **Erro: "Email not sent"**
- Verifique se `VITE_RESEND_API_KEY` está configurada corretamente

## 📱 **Teste Final**

1. **Acesse o site** em produção
2. **Teste o cadastro** de usuário
3. **Teste o login** 
4. **Teste a criação** de reserva
5. **Teste o pagamento** PIX
6. **Verifique se os emails** estão sendo enviados

---

**Seu site deve funcionar perfeitamente agora! 🎯**
