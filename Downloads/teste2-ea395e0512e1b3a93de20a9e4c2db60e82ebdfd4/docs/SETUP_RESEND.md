# 🚀 **CONFIGURAÇÃO PASSO A PASSO - RESEND**

## **📋 PASSO 1: Criar Conta no Resend**

### **1.1 Acessar o site**
- **Abra**: [resend.com](https://resend.com)
- **Clique**: "Get Started" ou "Sign Up"

### **1.2 Escolher método de cadastro**
- **GitHub** (recomendado)
- **Google** 
- **Email e senha**

### **1.3 Verificar email**
- **Verifique** sua caixa de entrada
- **Clique** no link de confirmação
- **Faça login** no painel

---

## **🔑 PASSO 2: Obter API Key**

### **2.1 Acessar API Keys**
- **No painel do Resend**: Clique em "API Keys" no menu lateral
- **Clique**: "Create API Key"

### **2.2 Configurar a chave**
- **Nome**: `Cookite JEPP 2025`
- **Permissões**: "Full Access"
- **Domínios**: Deixe vazio
- **Clique**: "Create"

### **2.3 Copiar a chave**
- **Copie** a chave que aparece (formato: `re_1234567890...`)
- **⚠️ IMPORTANTE**: Guarde em local seguro!
- **Clique**: "Done"

---

## **📁 PASSO 3: Configurar no Projeto**

### **3.1 Criar arquivo .env.local**
```bash
# Na raiz do projeto, crie o arquivo:
touch .env.local
```

### **3.2 Adicionar a API Key**
```bash
# .env.local
VITE_RESEND_API_KEY=re_sua_chave_aqui
```

**Exemplo real:**
```bash
VITE_RESEND_API_KEY=re_abc123def456ghi789jkl012mno345pqr678stu901vwx234
```

---

## **🧪 PASSO 4: Testar**

### **4.1 Reiniciar o projeto**
```bash
npm run dev
```

### **4.2 Fazer uma reserva de teste**
- **Preencha** o formulário
- **Use** seu email real
- **Verifique** se recebe o email

### **4.3 Verificar console**
- **Abra** o console do navegador (F12)
- **Procure** por mensagens de email

---

## **🚨 PROBLEMAS COMUNS**

### **❌ "Unauthorized"**
- **Solução**: Verificar se a API Key está correta

### **❌ "Domain not verified"**
- **Solução**: Usar `noreply@resend.dev` por enquanto

### **❌ Email não chega**
- **Solução**: Verificar pasta de spam

---

## **📞 PRECISA DE AJUDA?**

**Me diga em qual passo você está e qual problema encontrou!**

**Vou te ajudar a resolver! 🚀**

