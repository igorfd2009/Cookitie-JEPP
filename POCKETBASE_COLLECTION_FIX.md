# 🔧 Correção da Collection Orders no PocketBase

## 🎯 **Problema Identificado:**
O PocketBase está rejeitando pedidos com erro 400 porque a validação dos campos não está correta.

## ✅ **Solução: Reconfigurar Collection**

### **1. Acessar Admin Panel:**
- Vá em: `http://127.0.0.1:8090/_/`

### **2. Editar Collection "orders":**
- Clique em Collections → orders
- Clique no ícone de edição (lápis)

### **3. Configurar Campos Corretamente:**

#### **Campo: items**
- **Name**: `items`
- **Type**: `JSON`
- **Required**: ✅ **SIM**
- **Min length**: `0` (deixar vazio)
- **Max length**: `10000`

#### **Campo: total**
- **Name**: `total`
- **Type**: `Number`
- **Required**: ✅ **SIM**
- **Min**: `0`

#### **Campo: status**
- **Name**: `status`
- **Type**: `Select (single)`
- **Required**: ✅ **SIM**
- **Values** (um por linha):
```
pending
paid
preparing
ready
completed
```

#### **Campo: paymentMethod**
- **Name**: `paymentMethod`
- **Type**: `Text`
- **Required**: ✅ **SIM**
- **Pattern**: deixar vazio

#### **Campo: userId**
- **Name**: `userId`
- **Type**: `Text`
- **Required**: ✅ **SIM**
- **Min length**: `1`
- **Max length**: `100`

#### **Campo: pixCode (opcional)**
- **Name**: `pixCode`
- **Type**: `Text`
- **Required**: ❌ **NÃO**
- **Max length**: `1000`

#### **Campo: pickupCode (opcional)**
- **Name**: `pickupCode`
- **Type**: `Text`
- **Required**: ❌ **NÃO**
- **Max length**: `50`

### **4. Salvar Configurações:**
- Clique em **"Save"**

### **5. Testar Novamente:**
- Faça um novo pedido na aplicação
- Verifique os logs no console

---

## 🧪 **Teste Manual (Opcional):**

Para testar se a collection está funcionando:

```json
{
  "userId": "test123",
  "items": [
    {
      "id": "1",
      "name": "Cookie Chocolate",
      "price": 5.50,
      "quantity": 2
    }
  ],
  "total": 11.00,
  "status": "pending",
  "paymentMethod": "pix"
}
```

---

## 🔍 **Verificação:**

Após reconfigurar:
1. Faça um pedido na app
2. Verifique se aparece no admin panel
3. Se ainda der erro, me avise os logs detalhados
