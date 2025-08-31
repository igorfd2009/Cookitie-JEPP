# 🔐 VARIÁVEIS DE AMBIENTE - COOKITE JEPP

## 📋 **Arquivo .env.local**

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# 🌐 SUPABASE
VITE_SUPABASE_URL=https://deeichvgibhpbrowhaiq.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui

# 📧 RESEND (EMAIL)
VITE_RESEND_API_KEY=re_123456789...sua_chave_api_resend_aqui

# 🔑 PIX (OPCIONAL - para configurações específicas)
VITE_PIX_KEY_TYPE=email
VITE_PIX_KEY_VALUE=seu_email@dominio.com
VITE_MERCHANT_NAME=COOKITE JEPP
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

- **Substitua TODOS** os valores marcados com "sua_..."
- **Mantenha as chaves** VITE_ exatamente como estão
- **Não adicione espaços** antes ou depois do sinal de igual
- **Use aspas apenas** se o valor contiver espaços
- **Teste sempre** com valores pequenos primeiro
- **NUNCA commite** o arquivo .env.local no Git

## 🔑 **Onde Obter as Chaves:**

### **1. Supabase:**
- Acesse: https://supabase.com
- Vá em seu projeto
- Settings → API
- Copie URL e anon key

### **2. Resend:**
- Acesse: https://resend.com
- Crie conta gratuita
- API Keys → Create API Key
- Copie a chave gerada

### **3. PIX:**
- Configure no seu banco
- Escolha o tipo de chave (email, CPF, CNPJ, telefone)
- Use o valor exato fornecido pelo banco

## ✅ **Após Configurar:**

1. **Reinicie o servidor** de desenvolvimento
2. **Teste o sistema** com valores pequenos
3. **Verifique os logs** no console
4. **Teste o QR Code** com diferentes apps bancários
5. **Verifique se os emails** estão sendo enviados

## 🚨 **Problemas Comuns:**

- **Chave inválida**: Verifique se copiou corretamente
- **Email não enviado**: Verifique a API key do Resend
- **PIX não gerado**: Verifique a configuração da chave PIX
- **Erro de CORS**: Verifique as configurações do Supabase

---

**Configure com cuidado e seu sistema funcionará perfeitamente! 🚀**
