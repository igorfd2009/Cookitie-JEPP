# 🔐 VARIÁVEIS DE AMBIENTE - COOKITE JEPP
# ✅ CONFIGURADO PARA: CPF 42151999807, Empresa Cookitie, São Paulo

## 📋 **Arquivo .env.local**

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# 🌐 SUPABASE
VITE_SUPABASE_URL=https://deeichvgibhpbrowhaiq.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui

# 📧 RESEND (EMAIL)
VITE_RESEND_API_KEY=re_123456789...sua_chave_api_resend_aqui

# 🔑 PIX (CONFIGURADO)
VITE_PIX_KEY_TYPE=cpf
VITE_PIX_KEY_VALUE=42151999807
VITE_MERCHANT_NAME=COOKITIE
VITE_MERCHANT_CITY=SAO PAULO

# 🎯 CONFIGURAÇÕES DO EVENTO
VITE_EVENT_NAME=JEPP 2025
VITE_EVENT_DATE=12/09/2025
VITE_EVENT_LOCATION=Escola Estadual Exemplo - Ginásio / Stand B

# 📱 CONFIGURAÇÕES DO SITE
VITE_SITE_URL=https://cookite-jepp.netlify.app
VITE_APP_NAME=Cookite JEPP
VITE_APP_DESCRIPTION=Confeitaria temporária para o evento JEPP 2025

# 🔒 SEGURANÇA
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# 📊 CONFIGURAÇÕES DE DESCONTO
VITE_DISCOUNT_PERCENTAGE=20
VITE_DISCOUNT_DEADLINE=2025-09-10
```

## ⚠️ **IMPORTANTE:**

- **Substitua** `sua_chave_anonima_supabase_aqui` pela sua chave real do Supabase
- **Substitua** `re_123456789...sua_chave_api_resend_aqui` pela sua chave API do Resend
- **As configurações PIX já estão prontas** com seu CPF e dados da empresa

## 🔑 **Onde Obter as Chaves Restantes:**

### **1. Supabase:**
- Acesse: https://supabase.com
- Vá em seu projeto
- Settings → API
- Copie a anon key

### **2. Resend:**
- Acesse: https://resend.com
- Crie conta gratuita
- API Keys → Create API Key
- Copie a chave gerada

## ✅ **Status da Configuração:**

- **✅ PIX**: Configurado com CPF 42151999807
- **✅ Empresa**: Cookitie
- **✅ Cidade**: São Paulo
- **✅ Email**: nickaasalomao@gmail.com
- **⏳ Supabase**: Aguardando sua chave anon
- **⏳ Resend**: Aguardando sua API key

---

**Configure as chaves restantes e seu sistema PIX funcionará perfeitamente! 🚀**
