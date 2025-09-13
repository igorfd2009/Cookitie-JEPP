// debug-pocketbase-sync.js
// Script para diagnosticar problemas de sincronização no PocketBase

console.log('🔍 Diagnosticando sincronização do PocketBase...');

let authToken = null;

// Função para fazer login e obter token
async function loginAndGetToken() {
    try {
        const response = await fetch('/api/admins/auth-with-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: 'admin@cookittie.com',
                password: 'cookittie2025'
            })
        });
        
        if (response.status === 200) {
            const data = await response.json();
            authToken = data.token;
            console.log('✅ Login realizado com sucesso!');
            return true;
        } else {
            console.log('❌ Falha no login:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return false;
    }
}

// Função para verificar collections
async function checkCollections() {
    if (!authToken) {
        console.log('❌ Nenhum token disponível');
        return false;
    }
    
    try {
        const response = await fetch('/api/collections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('📋 Collections encontradas:', data.items?.length || 0);
            
            data.items.forEach(col => {
                console.log(`   - ${col.name} (${col.type})`);
            });
            
            const ordersCollection = data.items.find(c => c.name === 'orders');
            if (ordersCollection) {
                console.log('✅ Collection "orders" encontrada!');
                console.log('📊 Schema da collection orders:');
                ordersCollection.schema.forEach(field => {
                    console.log(`   - ${field.name}: ${field.type} (${field.required ? 'obrigatório' : 'opcional'})`);
                });
                return true;
            } else {
                console.log('❌ Collection "orders" NÃO encontrada!');
                return false;
            }
        } else {
            console.log('❌ Erro ao acessar collections:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao verificar collections:', error);
        return false;
    }
}

// Função para verificar pedidos existentes
async function checkExistingOrders() {
    if (!authToken) {
        console.log('❌ Nenhum token disponível');
        return;
    }
    
    try {
        const response = await fetch('/api/collections/orders/records', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('📦 Pedidos encontrados no banco:', data.items?.length || 0);
            
            if (data.items && data.items.length > 0) {
                console.log('📝 Primeiros 3 pedidos:');
                data.items.slice(0, 3).forEach((order, index) => {
                    console.log(`   ${index + 1}. ID: ${order.id}`);
                    console.log(`      UserID: ${order.userId}`);
                    console.log(`      Status: ${order.status}`);
                    console.log(`      Total: R$ ${order.total}`);
                    console.log(`      Items: ${order.items?.length || 0}`);
                    console.log(`      Criado: ${order.created}`);
                    console.log('      ---');
                });
            } else {
                console.log('⚠️ Nenhum pedido encontrado no banco de dados');
            }
        } else {
            console.log('❌ Erro ao acessar pedidos:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao verificar pedidos:', error);
    }
}

// Função para verificar localStorage
function checkLocalStorage() {
    console.log('💾 Verificando localStorage...');
    
    try {
        const cartData = localStorage.getItem('cookite_cart');
        const ordersData = localStorage.getItem('cookitie_orders');
        
        console.log('🛒 Carrinho no localStorage:', cartData ? 'Presente' : 'Ausente');
        if (cartData) {
            const cart = JSON.parse(cartData);
            console.log(`   - Itens no carrinho: ${cart.length}`);
        }
        
        console.log('📦 Pedidos no localStorage:', ordersData ? 'Presente' : 'Ausente');
        if (ordersData) {
            const orders = JSON.parse(ordersData);
            console.log(`   - Total de pedidos: ${orders.length}`);
            
            if (orders.length > 0) {
                console.log('📝 Primeiros 3 pedidos no localStorage:');
                orders.slice(0, 3).forEach((order, index) => {
                    console.log(`   ${index + 1}. ID: ${order.id}`);
                    console.log(`      UserID: ${order.userId}`);
                    console.log(`      Status: ${order.status}`);
                    console.log(`      Total: R$ ${order.total}`);
                    console.log(`      Items: ${order.items?.length || 0}`);
                    console.log(`      Criado: ${order.createdAt || order.created}`);
                    console.log('      ---');
                });
            }
        }
    } catch (error) {
        console.error('❌ Erro ao verificar localStorage:', error);
    }
}

// Função para criar um pedido de teste
async function createTestOrder() {
    if (!authToken) {
        console.log('❌ Nenhum token disponível');
        return false;
    }
    
    console.log('🧪 Criando pedido de teste...');
    
    try {
        const testOrder = {
            userId: 'test-user-123',
            items: [
                {
                    id: 'test-item-1',
                    name: 'Produto Teste',
                    price: 10.00,
                    quantity: 2
                }
            ],
            total: 20.00,
            status: 'pending',
            paymentMethod: 'pix',
            pixCode: 'TESTE123',
            pickupCode: 'ABC123'
        };
        
        const response = await fetch('/api/collections/orders/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(testOrder)
        });
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Pedido de teste criado com sucesso!');
            console.log('📊 ID do pedido:', data.id);
            return true;
        } else {
            console.log('❌ Falha ao criar pedido de teste:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao criar pedido de teste:', error);
        return false;
    }
}

// Função principal de diagnóstico
async function diagnosePocketBaseSync() {
    console.log('🚀 Iniciando diagnóstico completo de sincronização...');
    
    // 1. Login
    const loginSuccess = await loginAndGetToken();
    if (!loginSuccess) {
        console.log('🛑 Falha no login, parando diagnóstico');
        return;
    }
    
    // 2. Verificar collections
    const collectionsOk = await checkCollections();
    if (!collectionsOk) {
        console.log('🛑 Collection orders não existe, parando diagnóstico');
        return;
    }
    
    // 3. Verificar pedidos existentes
    await checkExistingOrders();
    
    // 4. Verificar localStorage
    checkLocalStorage();
    
    // 5. Criar pedido de teste
    console.log('\\n🧪 Testando criação de pedido...');
    const testOrderCreated = await createTestOrder();
    
    if (testOrderCreated) {
        console.log('\\n🔄 Verificando se o pedido foi criado...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkExistingOrders();
    }
    
    console.log('\\n🎯 Diagnóstico concluído!');
    console.log('\\n📋 Resumo:');
    console.log('   - Collection orders: ✅ Existe');
    console.log('   - Pedidos no banco:', testOrderCreated ? '✅ Funcionando' : '❌ Problema');
    console.log('   - localStorage: Verificado acima');
    console.log('\\n🔧 Próximos passos:');
    console.log('   1. Verificar se o frontend está usando o hook correto');
    console.log('   2. Verificar se há erros no console do navegador');
    console.log('   3. Testar criação de pedido pelo frontend');
}

// Executar diagnóstico
diagnosePocketBaseSync();
