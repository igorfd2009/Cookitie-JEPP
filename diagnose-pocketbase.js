// Script de diagnóstico para PocketBase
// Execute no console do navegador no PocketBase Admin

console.log('🔍 Diagnóstico do PocketBase...');

const diagnosePocketBase = async () => {
  try {
    // 1. Verificar se estamos conectados
    console.log('1. Verificando conexão...');
    const healthResponse = await fetch('/api/health');
    console.log('✅ PocketBase respondendo:', healthResponse.ok);

    // 2. Verificar collections existentes
    console.log('2. Verificando collections...');
    const collectionsResponse = await fetch('/api/collections');
    const collections = await collectionsResponse.json();
    
    console.log('📋 Collections encontradas:', collections.items.length);
    collections.items.forEach(col => {
      console.log(`- ${col.name} (${col.type})`);
    });

    // 3. Verificar se orders existe
    const ordersCollection = collections.items.find(col => col.name === 'orders');
    if (ordersCollection) {
      console.log('✅ Collection orders encontrada!');
      console.log('📊 Detalhes:', {
        id: ordersCollection.id,
        name: ordersCollection.name,
        fields: ordersCollection.schema.length,
        rules: {
          list: ordersCollection.listRule,
          view: ordersCollection.viewRule,
          create: ordersCollection.createRule,
          update: ordersCollection.updateRule,
          delete: ordersCollection.deleteRule
        }
      });
    } else {
      console.log('❌ Collection orders NÃO encontrada!');
      console.log('🔧 Solução: Criar collection orders manualmente');
    }

    // 4. Verificar usuários
    console.log('3. Verificando usuários...');
    const usersResponse = await fetch('/api/collections/users/records');
    const users = await usersResponse.json();
    console.log(`👥 Usuários encontrados: ${users.items.length}`);

    // 5. Verificar pedidos (se collection existir)
    if (ordersCollection) {
      console.log('4. Verificando pedidos...');
      try {
        const ordersResponse = await fetch('/api/collections/orders/records');
        const orders = await ordersResponse.json();
        console.log(`📦 Pedidos encontrados: ${orders.items.length}`);
        
        if (orders.items.length > 0) {
          console.log('📋 Últimos pedidos:', orders.items.slice(0, 3));
        }
      } catch (error) {
        console.log('❌ Erro ao buscar pedidos:', error.message);
      }
    }

    // 6. Verificar autenticação
    console.log('5. Verificando autenticação...');
    const authToken = localStorage.getItem('pocketbase_auth');
    if (authToken) {
      console.log('✅ Token de autenticação encontrado');
    } else {
      console.log('❌ Nenhum token de autenticação encontrado');
    }

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  }
};

// Executar diagnóstico
diagnosePocketBase();
