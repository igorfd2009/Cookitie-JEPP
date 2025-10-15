# 📋 Configuração Completa da Collection "orders" no PocketBase

## 🎯 Campos Necessários para Exibição Completa de Dados

### ✅ Campos Já Existentes (NÃO ALTERAR):
1. **userId** (text, required) - ID do usuário que fez o pedido
2. **items** (json, required) - Lista de itens do pedido
3. **total** (number, required) - Valor total do pedido
4. **status** (select, required) - Status do pedido
5. **paymentMethod** (text, required) - Método de pagamento
6. **pixCode** (text, optional) - Código PIX para pagamento
7. **pickupCode** (text, optional) - Código para retirada

---

## 🆕 Campos NOVOS a Adicionar:

### 📧 **Dados do Cliente** (Recomendado - Alta Prioridade)

Adicione estes campos para ter os dados do cliente sempre disponíveis, mesmo que a conta seja deletada:

#### 1. **userName** (Text)
- **Tipo**: Text
- **Required**: No (opcional)
- **Max Length**: 100
- **Descrição**: Nome completo do cliente

#### 2. **userEmail** (Email)
- **Tipo**: Email
- **Required**: No (opcional)
- **Descrição**: Email do cliente

#### 3. **userPhone** (Text)
- **Tipo**: Text
- **Required**: No (opcional)
- **Max Length**: 20
- **Descrição**: Telefone do cliente

---

### 📍 **Dados de Entrega/Retirada** (Opcional - Média Prioridade)

#### 4. **deliveryType** (Select)
- **Tipo**: Select
- **Required**: No
- **Options**: 
  - `pickup` - Retirar no local
  - `delivery` - Entrega em domicílio
- **Descrição**: Tipo de entrega

#### 5. **deliveryAddress** (Text)
- **Tipo**: Text
- **Required**: No
- **Max Length**: 200
- **Descrição**: Endereço de entrega (se aplicável)

#### 6. **deliveryDate** (Date)
- **Tipo**: Date
- **Required**: No
- **Descrição**: Data agendada para entrega/retirada

---

### 💬 **Observações e Notas** (Opcional - Baixa Prioridade)

#### 7. **customerNotes** (Text)
- **Tipo**: Text (Long text)
- **Required**: No
- **Max Length**: 500
- **Descrição**: Observações do cliente sobre o pedido

#### 8. **adminNotes** (Text)
- **Tipo**: Text (Long text)
- **Required**: No
- **Max Length**: 500
- **Descrição**: Notas internas do admin sobre o pedido

---

### 📊 **Dados de Pagamento** (Opcional)

#### 9. **paymentStatus** (Select)
- **Tipo**: Select
- **Required**: No
- **Options**:
  - `pending` - Aguardando pagamento
  - `approved` - Pago
  - `rejected` - Rejeitado
  - `refunded` - Reembolsado
- **Descrição**: Status específico do pagamento

#### 10. **paidAt** (DateTime)
- **Tipo**: DateTime
- **Required**: No
- **Descrição**: Data e hora que o pagamento foi confirmado

---

## 🔧 Como Adicionar os Campos no PocketBase

### Método 1: Via Interface Web (Recomendado)

1. **Acesse o Admin do PocketBase**
   ```
   http://localhost:8090/_/
   ```

2. **Vá em Collections → orders**

3. **Para cada campo novo, clique em "+ New field"**

4. **Configure o campo conforme especificado acima**

5. **Clique em "Save"**

---

### Método 2: Via Migration (Avançado)

Crie um arquivo de migration em `pb_migrations/`:

```javascript
/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39") // ID da collection orders

  // Adicionar campo userName
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "username01",
    "name": "userName",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 100,
      "pattern": ""
    }
  }))

  // Adicionar campo userEmail
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "useremail1",
    "name": "userEmail",
    "type": "email",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // Adicionar campo userPhone
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "userphone1",
    "name": "userPhone",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 20,
      "pattern": ""
    }
  }))

  // Adicionar campo customerNotes
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "custnotes1",
    "name": "customerNotes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 500,
      "pattern": ""
    }
  }))

  // Adicionar campo adminNotes
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "adminnote1",
    "name": "adminNotes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 500,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
```

---

## 📝 Atualizar o Código para Usar os Novos Campos

Depois de adicionar os campos, atualize o código:

### 1. Atualizar `usePocketBaseOrders.ts`

Na função `createOrder`, adicione os novos campos:

```typescript
const pocketBaseData: any = {
  userId: user.id,
  userName: user.name || profile?.name || '',  // ✅ NOVO
  userEmail: user.email || profile?.email || '',  // ✅ NOVO
  userPhone: profile?.phone || '',  // ✅ NOVO
  items: orderData.items.map(item => ({
    id: String(item.id),
    name: String(item.name),
    price: Number(item.price),
    quantity: Number(item.quantity)
  })),
  total: Number(orderData.total),
  status: status,
  paymentMethod: String(orderData.paymentMethod)
}
```

### 2. Atualizar `useAdminOrders.ts`

Os dados já serão carregados automaticamente do banco quando você buscar os pedidos:

```typescript
const converted: AdminOrder[] = records.map((order: any) => {
  return {
    id: order.id,
    userId: order.userId,
    userName: order.userName || 'Cliente não identificado',  // ✅ Usar do banco
    userEmail: order.userEmail || 'Email não disponível',  // ✅ Usar do banco
    userPhone: order.userPhone || '',  // ✅ NOVO
    items: order.items || [],
    total: order.total || 0,
    status: order.status || 'pending',
    paymentMethod: order.paymentMethod || 'pix',
    pixCode: order.pixCode,
    pickupCode: order.pickupCode,
    created: order.created,
    updated: order.updated
  }
})
```

---

## ✅ Campos Mínimos Recomendados para Começar

Se quiser começar simples, adicione **APENAS ESTES 3 CAMPOS**:

1. ✅ **userName** (Text, optional, max 100)
2. ✅ **userEmail** (Email, optional)
3. ✅ **userPhone** (Text, optional, max 20)

Com esses 3 campos, você já terá todos os dados principais do cliente sempre visíveis no painel admin!

---

## 🎯 Configuração Atual vs Recomendada

### ❌ Situação Atual:
```
orders:
  - userId (referência)
  - items
  - total
  - status
  - paymentMethod
  - pixCode
  - pickupCode
  
→ Nome/email buscados da collection users (pode falhar)
```

### ✅ Situação Recomendada:
```
orders:
  - userId (referência)
  - userName ⭐ NOVO
  - userEmail ⭐ NOVO
  - userPhone ⭐ NOVO
  - items
  - total
  - status
  - paymentMethod
  - pixCode
  - pickupCode
  
→ Nome/email salvos diretamente no pedido (sempre disponível)
```

---

## 🔄 Migrar Dados Existentes (Opcional)

Se você já tem pedidos no banco, pode querer preencher os campos novos com os dados dos usuários:

### Script para Popular userName e userEmail:

1. Acesse o Console do PocketBase
2. Execute este script:

```javascript
// Buscar todos os pedidos
const orders = $app.dao().findRecordsByExpr("orders")

// Para cada pedido, buscar dados do usuário
orders.forEach(order => {
  try {
    const user = $app.dao().findRecordById("users", order.getString("userId"))
    
    // Atualizar pedido com dados do usuário
    order.set("userName", user.getString("name"))
    order.set("userEmail", user.getString("email"))
    order.set("userPhone", user.getString("phone"))
    
    $app.dao().saveRecord(order)
    console.log("Atualizado pedido:", order.getId())
  } catch (e) {
    console.log("Erro ao atualizar pedido:", order.getId(), e)
  }
})

console.log("Migração concluída!")
```

---

## 🎨 Benefícios

Com esses campos adicionados:

✅ **Nome e email sempre visíveis** no painel admin  
✅ **Dados preservados** mesmo se o usuário deletar a conta  
✅ **Busca mais eficiente** - não precisa fazer join com users  
✅ **Histórico completo** - dados do momento da compra  
✅ **Export CSV completo** com todos os dados  
✅ **Melhor performance** - menos queries ao banco  

---

## 📞 Suporte

Se tiver dúvidas sobre como adicionar os campos, consulte:
- [Documentação do PocketBase - Collections](https://pocketbase.io/docs/collections/)
- [Documentação do PocketBase - Fields](https://pocketbase.io/docs/api-records/)

