// diagnose-pocketbase-admin.js
// Script para diagnosticar PocketBase quando já está logado como admin
console.log('🔍 Diagnóstico Avançado do PocketBase Admin...');

// Função para verificar se estamos realmente autenticados
async function checkAdminAuth() {
    try {
        console.log('1. Verificando autenticação atual...');
        
        // Tentar fazer uma requisição simples primeiro
        const response = await fetch('/api/collections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Importante para incluir cookies de sessão
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', [...response.headers.entries()]);
        
        if (response.status === 401) {
            console.log('❌ Erro 401: Não autenticado');
            console.log('🔧 Possíveis soluções:');
            console.log('   - Recarregue a página do admin');
            console.log('   - Faça logout e login novamente');
            console.log('   - Verifique se está na URL correta: http://localhost:8090/_/');
            return false;
        }
        
        if (response.status === 200) {
            console.log('✅ Autenticação OK!');
            const data = await response.json();
            console.log('📋 Collections encontradas:', data.items?.length || 0);
            
            if (data.items && data.items.length > 0) {
                console.log('📝 Lista de collections:');
                data.items.forEach(col => {
                    console.log(`   - ${col.name} (${col.type})`);
                });
                
                const ordersCollection = data.items.find(c => c.name === 'orders');
                if (ordersCollection) {
                    console.log('✅ Collection "orders" encontrada!');
                    console.log('📊 Detalhes da collection orders:');
                    console.log('   - ID:', ordersCollection.id);
                    console.log('   - Tipo:', ordersCollection.type);
                    console.log('   - Schema:', ordersCollection.schema?.length || 0, 'campos');
                    return true;
                } else {
                    console.log('❌ Collection "orders" NÃO encontrada!');
                    console.log('🔧 Precisa criar a collection "orders"');
                    return false;
                }
            } else {
                console.log('⚠️ Nenhuma collection encontrada');
                return false;
            }
        }
        
        console.log('⚠️ Status inesperado:', response.status);
        return false;
        
    } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        console.log('🔧 Possíveis soluções:');
        console.log('   - Verifique se o PocketBase está rodando');
        console.log('   - Verifique se está na URL correta');
        console.log('   - Tente recarregar a página');
        return false;
    }
}

// Função para verificar se podemos acessar dados de pedidos
async function checkOrdersAccess() {
    try {
        console.log('2. Testando acesso aos pedidos...');
        
        const response = await fetch('/api/collections/orders/records', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        console.log('Status da resposta (orders):', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Acesso aos pedidos OK!');
            console.log('📊 Total de pedidos:', data.items?.length || 0);
            
            if (data.items && data.items.length > 0) {
                console.log('📝 Primeiro pedido:', data.items[0]);
            }
            return true;
        } else if (response.status === 404) {
            console.log('❌ Collection "orders" não existe (404)');
            return false;
        } else if (response.status === 401) {
            console.log('❌ Sem permissão para acessar pedidos (401)');
            return false;
        } else {
            console.log('⚠️ Status inesperado para pedidos:', response.status);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao acessar pedidos:', error);
        return false;
    }
}

// Função principal de diagnóstico
async function diagnosePocketBaseAdmin() {
    console.log('🚀 Iniciando diagnóstico completo...');
    
    const authOk = await checkAdminAuth();
    if (!authOk) {
        console.log('🛑 Parando diagnóstico - problema de autenticação');
        return;
    }
    
    const ordersOk = await checkOrdersAccess();
    if (!ordersOk) {
        console.log('🔧 Próximos passos:');
        console.log('   1. Criar collection "orders"');
        console.log('   2. Configurar campos necessários');
        console.log('   3. Configurar regras de API');
    } else {
        console.log('🎉 Tudo funcionando perfeitamente!');
    }
}

// Executar diagnóstico
diagnosePocketBaseAdmin();
