// Script corrigido para diagnóstico do PocketBase
// Execute este script no console do navegador no PocketBase Admin APÓS fazer login

console.log('🔍 Diagnóstico do PocketBase (versão corrigida)...');

const diagnosePocketBaseFixed = async () => {
  try {
    // 1. Verificar se estamos no admin do PocketBase
    if (!window.location.href.includes('localhost:8090/_/')) {
      console.error('❌ Execute este script no PocketBase Admin (http://localhost:8090/_/)');
      console.log('🔧 Solução: Acesse http://localhost:8090/_/ primeiro');
      return;
    }

    // 2. Verificar se estamos logados
    console.log('1. Verificando autenticação...');
    const authToken = localStorage.getItem('pocketbase_auth');
    if (!authToken) {
      console.error('❌ Você não está logado no PocketBase Admin!');
      console.log('🔧 Solução: Faça login com admin@cookittie.com / cookittie2025');
      return;
    }
    console.log('✅ Usuário autenticado');

    // 3. Verificar se estamos conectados
    console.log('2. Verificando conexão...');
    const healthResponse = await fetch('/api/health');
    console.log('✅ PocketBase respondendo:', healthResponse.ok);

    // 4. Verificar collections existentes
    console.log('3. Verificando collections...');
    const collectionsResponse = await fetch('/api/collections', {
      headers: {
        'Authorization': `Bearer ${JSON.parse(authToken).token}`
      }
    });
    
    if (!collectionsResponse.ok) {
      console.error('❌ Erro ao buscar collections:', collectionsResponse.status);
      return;
    }
    
    const collections = await collectionsResponse.json();
    
    console.log('📋 Collections encontradas:', collections.items.length);
    collections.items.forEach(col => {
      console.log(`- ${col.name} (${col.type})`);
    });

    // 5. Verificar se orders existe
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
      console.log('📋 Passos:');
      console.log('1. Clique em "Collections" no menu lateral');
      console.log('2. Clique em "New Collection"');
      console.log('3. Nome: orders');
      console.log('4. Tipo: Base');
      console.log('5. Adicione os campos necessários');
    }

    // 6. Verificar usuários
    console.log('4. Verificando usuários...');
    try {
      const usersResponse = await fetch('/api/collections/users/records', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(authToken).token}`
        }
      });
      const users = await usersResponse.json();
      console.log(`👥 Usuários encontrados: ${users.items.length}`);
    } catch (error) {
      console.log('⚠️ Erro ao buscar usuários:', error.message);
    }

    // 7. Verificar pedidos (se collection existir)
    if (ordersCollection) {
      console.log('5. Verificando pedidos...');
      try {
        const ordersResponse = await fetch('/api/collections/orders/records', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(authToken).token}`
          }
        });
        const orders = await ordersResponse.json();
        console.log(`📦 Pedidos encontrados: ${orders.items.length}`);
        
        if (orders.items.length > 0) {
          console.log('📋 Últimos pedidos:', orders.items.slice(0, 3));
        }
      } catch (error) {
        console.log('❌ Erro ao buscar pedidos:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  }
};

// Executar diagnóstico
diagnosePocketBaseFixed();
