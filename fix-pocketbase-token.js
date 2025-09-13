// fix-pocketbase-token.js
// Script para corrigir problemas de token no PocketBase Admin

console.log('🔧 Corrigindo token do PocketBase Admin...');

let authToken = null;

// Função para fazer login e armazenar o token
async function loginAndStoreToken() {
    console.log('🔐 Fazendo login e armazenando token...');
    
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
        
        console.log('Status do login:', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            authToken = data.token;
            console.log('✅ Login realizado com sucesso!');
            console.log('🔑 Token armazenado:', authToken ? 'Sim' : 'Não');
            
            // Armazenar token no localStorage também
            if (authToken) {
                localStorage.setItem('pb_auth_token', authToken);
                console.log('💾 Token salvo no localStorage');
            }
            
            return true;
        } else {
            console.log('❌ Falha no login:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return false;
    }
}

// Função para testar acesso com token
async function testAccessWithToken() {
    console.log('🧪 Testando acesso com token...');
    
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
        
        console.log('Status da resposta:', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Acesso OK! Collections encontradas:', data.items?.length || 0);
            
            if (data.items && data.items.length > 0) {
                console.log('📋 Collections:');
                data.items.forEach(col => {
                    console.log(`   - ${col.name} (${col.type})`);
                });
                
                const ordersCollection = data.items.find(c => c.name === 'orders');
                if (ordersCollection) {
                    console.log('✅ Collection "orders" encontrada!');
                    console.log('📊 Detalhes da collection orders:');
                    console.log('   - ID:', ordersCollection.id);
                    console.log('   - Schema:', ordersCollection.schema?.length || 0, 'campos');
                    return true;
                } else {
                    console.log('❌ Collection "orders" NÃO encontrada!');
                    console.log('🔧 Precisa criar a collection "orders"');
                    return false;
                }
            }
        } else {
            console.log('❌ Ainda sem acesso:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao testar acesso:', error);
        return false;
    }
}

// Função para criar a collection orders se não existir
async function createOrdersCollection() {
    console.log('🔧 Criando collection "orders"...');
    
    if (!authToken) {
        console.log('❌ Nenhum token disponível para criar collection');
        return false;
    }
    
    try {
        const collectionData = {
            name: 'orders',
            type: 'base',
            schema: [
                {
                    name: 'userId',
                    type: 'relation',
                    required: true,
                    options: {
                        collectionId: '_pb_users_auth_',
                        cascadeDelete: true
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
                    required: true
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
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            createRule: '@request.auth.id != "" && @request.auth.id = userId',
            updateRule: '@request.auth.id != ""',
            deleteRule: 'userId = @request.auth.id'
        };
        
        const response = await fetch('/api/collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(collectionData)
        });
        
        console.log('Status da criação:', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Collection "orders" criada com sucesso!');
            console.log('📊 ID da collection:', data.id);
            return true;
        } else {
            console.log('❌ Falha ao criar collection:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao criar collection:', error);
        return false;
    }
}

// Função principal
async function fixPocketBaseToken() {
    console.log('🚀 Iniciando correção de token...');
    
    // 1. Fazer login e armazenar token
    const loginSuccess = await loginAndStoreToken();
    if (!loginSuccess) {
        console.log('🛑 Falha no login, parando...');
        return;
    }
    
    // 2. Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Testar acesso com token
    const accessOk = await testAccessWithToken();
    
    if (!accessOk) {
        console.log('🔧 Collection "orders" não existe, criando...');
        const createSuccess = await createOrdersCollection();
        
        if (createSuccess) {
            console.log('🎉 Collection "orders" criada com sucesso!');
            console.log('🔄 Testando acesso novamente...');
            await testAccessWithToken();
        }
    } else {
        console.log('🎉 Tudo funcionando perfeitamente!');
    }
}

// Executar correção
fixPocketBaseToken();
