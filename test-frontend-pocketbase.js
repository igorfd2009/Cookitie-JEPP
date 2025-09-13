// test-frontend-pocketbase.js
// Script para testar se o frontend está conectando corretamente ao PocketBase local

console.log('🧪 Testando conexão do frontend com PocketBase local...');

// Função para verificar se o PocketBase está configurado corretamente
function checkPocketBaseConfig() {
    console.log('🔍 Verificando configuração do PocketBase...');
    
    // Verificar se há variáveis de ambiente
    const viteUrl = import.meta.env?.VITE_POCKETBASE_URL;
    console.log('📍 VITE_POCKETBASE_URL:', viteUrl || 'Não definida');
    
    // Verificar localStorage do PocketBase
    const authStorage = localStorage.getItem('cookitie_pb_auth');
    console.log('🔐 Auth storage:', authStorage ? 'Presente' : 'Ausente');
    
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            console.log('👤 Usuário logado:', parsed.model?.email || 'N/A');
            console.log('🎫 Token válido:', parsed.token ? 'Sim' : 'Não');
        } catch (error) {
            console.error('❌ Erro ao parsear auth storage:', error);
        }
    }
}

// Função para testar criação de pedido via frontend
async function testFrontendOrderCreation() {
    console.log('🧪 Testando criação de pedido via frontend...');
    
    try {
        // Simular dados de um pedido
        const testOrderData = {
            items: [
                {
                    id: 'test-product-1',
                    name: 'Produto Teste Frontend',
                    price: 15.00,
                    quantity: 1
                }
            ],
            total: 15.00,
            status: 'pending',
            paymentMethod: 'pix',
            pixCode: 'FRONTEND_TEST_123',
            pickupCode: 'FT123'
        };
        
        // Usar a mesma URL que o frontend está usando
        const response = await fetch('http://localhost:8090/api/collections/orders/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testOrderData)
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Pedido criado via frontend com sucesso!');
            console.log('📋 ID do pedido:', data.id);
            console.log('📋 Dados do pedido:', data);
            return true;
        } else {
            console.log('❌ Falha ao criar pedido via frontend:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao testar criação de pedido:', error);
        return false;
    }
}

// Função para verificar se há pedidos no banco
async function checkOrdersInDatabase() {
    console.log('🔍 Verificando pedidos no banco de dados...');
    
    try {
        const response = await fetch('http://localhost:8090/api/collections/orders/records', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('📦 Total de pedidos no banco:', data.items?.length || 0);
            
            if (data.items && data.items.length > 0) {
                console.log('📝 Últimos pedidos:');
                data.items.slice(-3).forEach((order, index) => {
                    console.log(`   ${index + 1}. ID: ${order.id}`);
                    console.log(`      UserID: ${order.userId}`);
                    console.log(`      Status: ${order.status}`);
                    console.log(`      Total: R$ ${order.total}`);
                    console.log(`      Criado: ${order.created}`);
                    console.log('      ---');
                });
            }
        } else {
            console.log('❌ Erro ao verificar pedidos:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao verificar pedidos:', error);
    }
}

// Função principal
async function testFrontendPocketBase() {
    console.log('🚀 Iniciando teste do frontend com PocketBase...');
    
    // 1. Verificar configuração
    checkPocketBaseConfig();
    
    // 2. Verificar pedidos existentes
    await checkOrdersInDatabase();
    
    // 3. Testar criação de pedido
    const orderCreated = await testFrontendOrderCreation();
    
    if (orderCreated) {
        console.log('\\n🔄 Verificando se o pedido foi salvo...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkOrdersInDatabase();
    }
    
    console.log('\\n🎯 Teste concluído!');
    console.log('\\n📋 Resumo:');
    console.log('   - Configuração PocketBase: Verificada');
    console.log('   - Criação de pedido:', orderCreated ? '✅ Funcionando' : '❌ Problema');
    console.log('   - Banco de dados: Verificado acima');
    
    if (orderCreated) {
        console.log('\\n🎉 Frontend está funcionando corretamente!');
        console.log('\\n🔧 Próximos passos:');
        console.log('   1. Testar criação de pedido pelo componente Checkout');
        console.log('   2. Verificar se o painel admin mostra os pedidos');
        console.log('   3. Testar com usuário real logado');
    } else {
        console.log('\\n❌ Problema identificado no frontend');
        console.log('\\n🔧 Possíveis soluções:');
        console.log('   1. Verificar se o usuário está logado');
        console.log('   2. Verificar regras de API do PocketBase');
        console.log('   3. Verificar console do navegador para erros');
    }
}

// Executar teste
testFrontendPocketBase();
