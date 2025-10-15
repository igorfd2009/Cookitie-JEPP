# 🔐 Configuração do Admin Cookittie

## Credenciais de Administrador

Para acessar o painel de administrador, você precisa criar uma conta com as seguintes credenciais:

### 📧 Email do Admin
```
admin@cookittie.com
```

### 🔑 Senha Sugerida
```
admin123
```
**⚠️ IMPORTANTE: Altere esta senha após o primeiro login!**

---

## 🚀 Como Criar a Conta de Admin

### Opção 1: Via Interface Web (Recomendado)

1. **Inicie o PocketBase**
   ```bash
   ./pocketbase serve
   ```
   ou no Windows:
   ```bash
   pocketbase.exe serve
   ```

2. **Acesse a interface web**
   - Abra seu navegador em: `http://localhost:8090/_/`
   - Faça login no painel admin do PocketBase (primeira vez, você cria a conta)

3. **Crie o usuário admin**
   - Vá em **Collections** → **users**
   - Clique em **New record**
   - Preencha:
     - **email**: `admin@cookittie.com`
     - **password**: `admin123` (ou sua senha preferida)
     - **name**: `Administrador`
     - Marque **emailVisibility** como `true`
   - Clique em **Create**

### Opção 2: Via Cadastro no Site

1. **Acesse o site Cookittie**
   ```
   http://localhost:5173
   ```

2. **Clique em "Entrar" no canto superior direito**

3. **Clique em "Não tem conta? Cadastre-se"**

4. **Preencha com as credenciais de admin:**
   - **Nome**: Administrador
   - **Email**: admin@cookittie.com
   - **Senha**: admin123 (ou sua senha preferida)
   - **Telefone**: (opcional)

5. **Clique em "Criar conta"**

---

## 🎛️ Como Acessar o Painel Admin

Após criar a conta:

1. **Faça login** com as credenciais:
   - Email: `admin@cookittie.com`
   - Senha: a senha que você definiu

2. **O sistema detectará automaticamente** que você é admin e redirecionará para o painel de administração

3. **Pronto!** Você terá acesso a:
   - 📊 Estatísticas completas
   - 📦 Gestão de pedidos
   - 👥 Dados dos clientes
   - 📥 Exportação de dados
   - ✅ Atualização de status de pedidos

---

## 🔒 Segurança

### Recomendações:

1. **Altere a senha padrão** após o primeiro login
2. **Use uma senha forte** com pelo menos:
   - 8 caracteres
   - Letras maiúsculas e minúsculas
   - Números
   - Caracteres especiais

3. **Não compartilhe** as credenciais de admin

4. **Configure backup regular** do banco de dados PocketBase

---

## ⚙️ Configuração Avançada

Se quiser alterar o email de admin, edite o arquivo:
```
components/AuthModal.tsx
```

Na linha 50, altere:
```typescript
if (formData.email === 'admin@cookittie.com') {
```

Para:
```typescript
if (formData.email === 'seu-email@exemplo.com') {
```

---

## 🆘 Problemas Comuns

### Não consigo fazer login
- Verifique se o PocketBase está rodando
- Verifique se a conta foi criada corretamente
- Confirme que está usando o email correto: `admin@cookittie.com`

### Não sou redirecionado para o painel admin
- Verifique se está usando exatamente o email: `admin@cookittie.com`
- Limpe o cache do navegador
- Faça logout e login novamente

### Esqueci a senha
1. Acesse o painel do PocketBase: `http://localhost:8090/_/`
2. Vá em **Collections** → **users**
3. Encontre o usuário `admin@cookittie.com`
4. Clique em editar e redefina a senha

---

## 📞 Suporte

Se precisar de ajuda adicional, consulte a documentação do PocketBase:
https://pocketbase.io/docs/

