// fix-pocketbase-session.js
// Script para corrigir problemas de sessão no PocketBase Admin

console.log('🔧 Corrigindo sessão do PocketBase Admin...');

// Função para verificar se estamos na página correta
function checkCurrentPage() {
    const currentUrl = window.location.href;
    console.log('📍 URL atual:', currentUrl);
    
    if (!currentUrl.includes('localhost:8090/_/')) {
        console.log('❌ Você não está na página correta do PocketBase Admin!');
        console.log('🔧 Acesse: http://localhost:8090/_/');
        return false;
    }
    
    console.log('✅ URL correta do PocketBase Admin');
    return true;
}

// Função para verificar se há elementos de login na página
function checkLoginElements() {
    const loginForm = document.querySelector('form[action*="login"]');
    const loginButton = document.querySelector('button[type="submit"]');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (loginForm || loginButton || emailInput || passwordInput) {
        console.log('⚠️ Elementos de login encontrados - você pode não estar logado');
        console.log('🔧 Faça login com: admin@cookittie.com / cookittie2025');
        return false;
    }
    
    console.log('✅ Nenhum elemento de login encontrado - parece estar logado');
    return true;
}

// Função para verificar cookies de sessão
function checkSessionCookies() {
    const cookies = document.cookie.split(';');
    console.log('🍪 Cookies encontrados:', cookies.length);
    
    const sessionCookies = cookies.filter(cookie => 
        cookie.includes('pb_auth') || 
        cookie.includes('session') || 
        cookie.includes('token')
    );
    
    if (sessionCookies.length > 0) {
        console.log('✅ Cookies de sessão encontrados:', sessionCookies);
        return true;
    } else {
        console.log('❌ Nenhum cookie de sessão encontrado');
        return false;
    }
}

// Função para tentar fazer login programaticamente
async function tryProgrammaticLogin() {
    console.log('🔐 Tentando fazer login programaticamente...');
    
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
            console.log('✅ Login realizado com sucesso!');
            console.log('Token:', data.token ? 'Presente' : 'Ausente');
            return true;
        } else {
            console.log('❌ Falha no login:', response.status);
            const error = await response.text();
            console.log('Erro:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro no login programático:', error);
        return false;
    }
}

// Função para testar acesso após login
async function testAccessAfterLogin() {
    console.log('🧪 Testando acesso após login...');
    
    try {
        const response = await fetch('/api/collections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
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
                    return true;
                } else {
                    console.log('❌ Collection "orders" NÃO encontrada!');
                    console.log('🔧 Precisa criar a collection "orders"');
                    return false;
                }
            }
        } else {
            console.log('❌ Ainda sem acesso:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao testar acesso:', error);
        return false;
    }
}

// Função principal de correção
async function fixPocketBaseSession() {
    console.log('🚀 Iniciando correção de sessão...');
    
    // 1. Verificar página
    if (!checkCurrentPage()) {
        return;
    }
    
    // 2. Verificar elementos de login
    const hasLoginElements = checkLoginElements();
    
    // 3. Verificar cookies
    const hasCookies = checkSessionCookies();
    
    // 4. Se não estiver logado, tentar login programático
    if (hasLoginElements || !hasCookies) {
        console.log('🔐 Tentando fazer login...');
        const loginSuccess = await tryProgrammaticLogin();
        
        if (loginSuccess) {
            // Aguardar um pouco para a sessão ser estabelecida
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Testar acesso
            const accessOk = await testAccessAfterLogin();
            if (accessOk) {
                console.log('🎉 Sessão corrigida com sucesso!');
            } else {
                console.log('⚠️ Login OK, mas ainda sem acesso às collections');
            }
        } else {
            console.log('❌ Falha no login programático');
            console.log('🔧 Tente fazer login manualmente');
        }
    } else {
        console.log('✅ Parece estar logado, testando acesso...');
        const accessOk = await testAccessAfterLogin();
        if (!accessOk) {
            console.log('🔧 Mesmo logado, sem acesso. Tentando login programático...');
            await tryProgrammaticLogin();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await testAccessAfterLogin();
        }
    }
}

// Executar correção
fixPocketBaseSession();
