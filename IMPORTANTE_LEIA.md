# ⚠️ IMPORTANTE - LEIA ANTES DE USAR O SISTEMA

## 🚨 Status Atual do Sistema

O sistema está **FUNCIONANDO NORMALMENTE**, mas com uma **limitação temporária**:

### ❌ **Problema Atual:**
Os campos `userName`, `userEmail` e `userPhone` **NÃO estão sendo salvos** nos pedidos porque esses campos ainda **NÃO EXISTEM** na collection `orders` do PocketBase.

### ✅ **O que funciona agora:**
- ✅ Criação de pedidos
- ✅ Pagamentos via PIX
- ✅ Carrinho de compras
- ✅ Painel admin
- ✅ Visualização de pedidos
- ⚠️ Nome/email buscados da collection `users` (pode falhar se usuário for deletado)

---

## 🔧 Como Resolver (5 minutos):

### **Passo 1: Adicionar os Campos no PocketBase**

1. **Acesse o Admin do PocketBase:**
   ```
   http://localhost:8090/_/
   ```
   OU
   ```
   https://seu-dominio.fly.io/_/
   ```

2. **Vá em Collections → orders**

3. **Adicione 3 campos clicando em "+ New field":**

#### Campo 1: userName
- Nome: `userName`
- Tipo: `Text`
- Required: ❌ Não
- Max length: `100`
- Clique em **Create**

#### Campo 2: userEmail
- Nome: `userEmail`
- Tipo: `Email`
- Required: ❌ Não
- Clique em **Create**

#### Campo 3: userPhone
- Nome: `userPhone`
- Tipo: `Text`
- Required: ❌ Não
- Max length: `20`
- Clique em **Create**

4. **Clique em "Save"** para salvar a collection

---

### **Passo 2: Reativar o Código**

Após adicionar os campos, edite o arquivo `hooks/usePocketBaseOrders.ts`:

**Procure pelas linhas 159-167 e DESCOMENTE:**

```typescript
// ANTES (comentado):
// if (user.name || profile?.name) {
//   pocketBaseData.userName = (user.name || profile?.name || '').trim()
// }
// if (user.email || profile?.email) {
//   pocketBaseData.userEmail = (user.email || profile?.email || '').trim()
// }
// if (profile?.phone) {
//   pocketBaseData.userPhone = profile.phone.trim()
// }

// DEPOIS (descomentado):
if (user.name || profile?.name) {
  pocketBaseData.userName = (user.name || profile?.name || '').trim()
}
if (user.email || profile?.email) {
  pocketBaseData.userEmail = (user.email || profile?.email || '').trim()
}
if (profile?.phone) {
  pocketBaseData.userPhone = profile.phone.trim()
}
```

---

### **Passo 3: Fazer Commit e Deploy**

```bash
git add hooks/usePocketBaseOrders.ts
git commit -m "Reativar campos userName, userEmail e userPhone"
git push
```

---

## 📊 Benefícios Após Ativar:

✅ **Nome e email salvos diretamente no pedido**  
✅ **Dados preservados mesmo se usuário deletar conta**  
✅ **Busca mais rápida (não precisa fazer join)**  
✅ **Histórico completo e confiável**  
✅ **Export CSV com todos os dados**  
✅ **Painel admin mais completo**  

---

## 📝 Documentação Completa

Para mais detalhes, veja o arquivo: **`POCKETBASE_ORDERS_CONFIG.md`**

Ele contém:
- Instruções passo a passo completas
- Script de migration
- Campos opcionais adicionais
- Como migrar dados existentes

---

## ⏰ Quando Fazer?

**Recomendação:** Adicione os campos o quanto antes para garantir que todos os pedidos futuros tenham os dados completos dos clientes.

**Tempo necessário:** 5 minutos

**Dificuldade:** Fácil (apenas adicionar 3 campos no PocketBase)

---

## 🆘 Problemas?

Se tiver qualquer dúvida, consulte:
- `POCKETBASE_ORDERS_CONFIG.md` - Documentação completa
- [Documentação do PocketBase](https://pocketbase.io/docs/)

---

## ✅ Checklist Rápido

- [ ] Acessei o admin do PocketBase
- [ ] Adicionei o campo `userName` (Text, max 100)
- [ ] Adicionei o campo `userEmail` (Email)
- [ ] Adicionei o campo `userPhone` (Text, max 20)
- [ ] Salvei a collection
- [ ] Descomentei o código em `hooks/usePocketBaseOrders.ts`
- [ ] Fiz commit e push
- [ ] Testei criando um novo pedido
- [ ] Verifiquei no painel admin que os dados aparecem

---

**🎉 Após seguir esses passos, o sistema estará 100% funcional com todos os dados dos clientes!**

