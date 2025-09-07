# 📦 PocketBase - A Opção MAIS SIMPLES de Todas

## 🎯 **Por que PocketBase?**

- ✅ **UM ARQUIVO ÚNICO** - Só baixar e rodar
- ✅ **ZERO CONFIGURAÇÃO** - Funciona na primeira vez
- ✅ **ADMIN PANEL** automático
- ✅ **API REST** automática
- ✅ **Banco SQLite** embutido
- ✅ **Tempo real** nativo
- ✅ **Totalmente gratuito**

## 🚀 **Configuração SUPER Rápida (2 minutos)**

### **1. Baixar PocketBase**

1. **Acesse**: [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
2. **Baixe** para Windows: `pocketbase_windows_amd64.zip`
3. **Extraia** na pasta do projeto
4. **Renomeie** para `pocketbase.exe`

### **2. Executar PocketBase**

```bash
# No terminal do projeto
./pocketbase.exe serve
```

**Pronto! 🎉**
- Admin: `http://localhost:8090/_/`
- API: `http://localhost:8090/api/`

> Produção: exponha via HTTPS e configure CORS e redirecionamento (veja abaixo).

### **3. Configurar Collections (1 minuto)**

1. **Abra**: `http://localhost:8090/_/`
2. **Crie** conta admin
3. **Vá em** "Collections"
4. **Crie** collection `orders`:

```json
{
  "name": "orders",
  "fields": [
    {"name": "userId", "type": "text", "required": true},
    {"name": "items", "type": "json", "required": true},
    {"name": "total", "type": "number", "required": true},
    {"name": "status", "type": "select", "options": ["pending", "paid", "preparing", "ready", "completed"]},
    {"name": "paymentMethod", "type": "text", "required": true},
    {"name": "pixCode", "type": "text"},
    {"name": "pickupCode", "type": "text"}
  ]
}
```

## 📋 **Instalar SDK**

```bash
npm install pocketbase
```

## 🌐 CORS, HTTPS e Variáveis de Ambiente

- No cliente (Vite/Netlify):
```env
VITE_POCKETBASE_URL=https://api.seu-dominio.com
```

- No servidor (PocketBase):
```env
PB_ALLOWED_ORIGINS="https://seu-site.netlify.app"
PB_FORCE_HTTPS="true"
```

Os hooks em `pb_hooks/cors_https_logging.js` já adicionam CORS, redirecionam para HTTPS quando `PB_FORCE_HTTPS=true` e logam todas as requisições e eventos de autenticação.

## 🔧 **Código Super Simples**

### **Configuração (3 linhas)**

```typescript
// lib/pocketbase.ts
import PocketBase from 'pocketbase'

export const pb = new PocketBase('http://localhost:8090')
```

### **Hook Completo**

```typescript
// hooks/usePocketBaseOrders.ts
import { useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

export const usePocketBaseOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Carregar pedidos
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const records = await pb.collection('orders').getFullList()
        setOrders(records)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    // Tempo real automático
    pb.collection('orders').subscribe('*', (e) => {
      loadOrders() // Recarrega quando há mudanças
    })
  }, [])

  // Criar pedido
  const createOrder = async (data) => {
    return await pb.collection('orders').create(data)
  }

  // Atualizar status
  const updateStatus = async (id, status) => {
    return await pb.collection('orders').update(id, { status })
  }

  return {
    orders,
    loading,
    createOrder,
    updateStatus
  }
}
```

## 🎯 **Vantagens Absurdas**

### **✅ Simplicidade Extrema**
- **2 minutos** para configurar
- **1 arquivo** para rodar
- **Zero dependências** externas

### **✅ Admin Panel Grátis**
- **Dashboard** automático
- **CRUD** visual
- **Backup** com um clique

### **✅ Performance**
- **SQLite** super rápido
- **Local** = zero latência
- **Tamanho** mínimo

### **✅ Deploy Fácil**
- **Docker** em 1 linha
- **VPS** simples
- **Heroku** gratuito

## 🚀 **Comparação Final**

| Recurso | PocketBase | Firebase | Supabase |
|---------|------------|----------|----------|
| **Configuração** | ✅ 2 min | ⚠️ 10 min | ❌ 30+ min |
| **Complexidade** | ✅ Zero | ⚠️ Média | ❌ Alta |
| **Erros** | ✅ Zero | ⚠️ Poucos | ❌ Muitos |
| **Admin Panel** | ✅ Automático | ❌ Manual | ❌ Manual |
| **Custo** | ✅ Grátis | ⚠️ Limitado | ⚠️ Limitado |
| **Dependências** | ✅ Zero | ❌ Muitas | ❌ Muitas |

## 🎉 **PocketBase é PERFEITO para seu projeto!**

### **Por que escolher PocketBase:**
1. **Funciona na primeira tentativa**
2. **Zero configuração**
3. **Admin panel automático**
4. **Sincronização perfeita**
5. **Totalmente gratuito**

### **Deploy em Produção:**
```bash
# Docker (1 linha)
docker run -p 8090:8090 -v ./pb_data:/pb_data pocketbase/pocketbase:latest serve --http=0.0.0.0:8090
```

**PocketBase = Simplicidade + Poder + Zero Dor de Cabeça! 🚀**
