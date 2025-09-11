// Script para configurar a collection orders no PocketBase
// Execute este script no console do navegador no PocketBase Admin

console.log('🔧 Configurando collection orders no PocketBase...');

// 1. Primeiro, vamos verificar se a collection existe
const checkCollection = async () => {
  try {
    const response = await fetch('/api/collections');
    const collections = await response.json();
    
    const ordersCollection = collections.items.find(col => col.name === 'orders');
    
    if (ordersCollection) {
      console.log('✅ Collection orders encontrada:', ordersCollection);
      return ordersCollection;
    } else {
      console.log('❌ Collection orders não encontrada. Criando...');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar collections:', error);
    return null;
  }
};

// 2. Criar a collection orders se não existir
const createOrdersCollection = async () => {
  const collectionData = {
    name: 'orders',
    type: 'base',
    schema: [
      {
        name: 'userId',
        type: 'text',
        required: true,
        options: {
          min: 1,
          max: 100
        }
      },
      {
        name: 'items',
        type: 'json',
        required: true
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        options: {
          min: 0
        }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['pending', 'paid', 'preparing', 'ready', 'completed']
        }
      },
      {
        name: 'paymentMethod',
        type: 'text',
        required: true,
        options: {
          values: ['pix']
        }
      },
      {
        name: 'pixCode',
        type: 'text',
        required: false
      },
      {
        name: 'pickupCode',
        type: 'text',
        required: false
      }
    ],
    indexes: [
      'CREATE INDEX idx_orders_userId ON orders (userId)',
      'CREATE INDEX idx_orders_status ON orders (status)',
      'CREATE INDEX idx_orders_created ON orders (created)'
    ],
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: 'userId = @request.auth.id'
  };

  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('pocketbase_auth')}`
      },
      body: JSON.stringify(collectionData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Collection orders criada com sucesso:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('❌ Erro ao criar collection:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return null;
  }
};

// 3. Executar o setup
const setupPocketBase = async () => {
  console.log('🚀 Iniciando setup do PocketBase...');
  
  // Verificar se estamos no admin do PocketBase
  if (!window.location.href.includes('localhost:8090/_/')) {
    console.error('❌ Execute este script no PocketBase Admin (http://localhost:8090/_/)');
    return;
  }

  // Verificar collection
  const existingCollection = await checkCollection();
  
  if (!existingCollection) {
    // Criar collection
    const newCollection = await createOrdersCollection();
    if (newCollection) {
      console.log('🎉 Setup concluído! Collection orders criada.');
      console.log('📋 Próximos passos:');
      console.log('1. Acesse Collections → orders');
      console.log('2. Verifique se os campos estão corretos');
      console.log('3. Teste criando um pedido no frontend');
    }
  } else {
    console.log('✅ Collection orders já existe. Verificando configuração...');
    console.log('📋 Collection atual:', existingCollection);
  }
};

// Executar
setupPocketBase();
