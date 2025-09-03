# Guia Completo: Configuração do Resend API

## 🎯 Objetivo
Configurar o sistema de email do Cookite usando o Resend para envio de confirmações, agradecimentos e lembretes.

## 📋 Pré-requisitos
- Conta no Resend (gratuita)
- Acesso ao painel do Resend
- Projeto Cookite rodando localmente

## 🚀 Passo a Passo

### 1. Criar Conta no Resend
1. Acesse [resend.com](https://resend.com)
2. Clique em "Sign Up" ou "Get Started"
3. Crie sua conta (pode usar Google, GitHub ou email)
4. Confirme seu email

### 2. Obter a Chave da API
1. Faça login no painel do Resend
2. No menu lateral, clique em **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome para sua chave (ex: "Cookite Email System")
5. Selecione as permissões:
   - ✅ Send emails
   - ✅ Read domains
6. Clique em **"Create"**
7. **IMPORTANTE**: Copie a chave que aparece (começa com `re_`)

### 3. Configurar o Projeto
1. No seu projeto Cookite, crie um arquivo chamado `.env.local` na raiz
2. Adicione a seguinte linha:
   ```
   VITE_RESEND_API_KEY=re_sua_chave_aqui
   ```
3. Substitua `re_sua_chave_aqui` pela chave que você copiou
4. Salve o arquivo

### 4. Verificar a Configuração
1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse a aplicação no navegador
3. Vá para a seção "Configuração do Sistema"
4. Verifique se a chave aparece como "Configurado"

### 5. Testar o Sistema
1. Na seção "Teste Rápido do Resend", clique em "Testar Conexão"
2. Se aparecer "✅ Chave da API do Resend está funcionando!", está tudo certo!
3. Use o "Teste de Email" para enviar emails de teste

## 🔧 Solução de Problemas

### Erro: "Chave da API não configurada"
- Verifique se o arquivo `.env.local` está na raiz do projeto
- Confirme se a chave começa com `re_`
- Reinicie o servidor após criar/modificar o arquivo

### Erro: "Erro na chave da API do Resend"
- Verifique se a chave está correta
- Confirme se a conta do Resend está ativa
- Verifique se não há espaços extras na chave

### Erro: "Erro ao testar a API do Resend"
- Verifique sua conexão com a internet
- Tente novamente em alguns minutos
- Verifique se o Resend não está em manutenção

## 📧 Tipos de Email Configurados

O sistema está configurado para enviar:

1. **Email de Agradecimento** - Após reserva confirmada
2. **Email de Confirmação de Pagamento** - Após pagamento PIX
3. **Email de Lembrete** - 24h antes do evento

## 🎨 Personalização

Para personalizar os emails, edite os arquivos:
- `utils/emailConfig.ts` - Templates e configurações
- `utils/emailService.ts` - Lógica de envio

## 🔒 Segurança

- Nunca compartilhe sua chave da API
- Não commite o arquivo `.env.local` no Git
- Use variáveis de ambiente em produção
- Monitore o uso da API no painel do Resend

## 💰 Custos

- **Gratuito**: 3.000 emails/mês
- **Pago**: $0.80 por 1.000 emails adicionais
- **Domínios**: Primeiro domínio gratuito

## 📞 Suporte

- [Documentação do Resend](https://resend.com/docs)
- [Status do Serviço](https://status.resend.com)
- [Comunidade](https://github.com/resendlabs/resend)

---

**Próximo passo**: Após configurar o Resend, você pode testar o sistema completo de reservas e emails!
