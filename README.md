# 🍰 Cookite JEPP - Sistema de Pedidos Online

## 📋 Descrição do Projeto

**Cookite JEPP** é uma plataforma de e-commerce completa desenvolvida para o evento JEPP (Jornada de Empreendedorismo e Projetos), permitindo que clientes façam pedidos antecipados de doces artesanais fabricados pelos alunos participantes.

## ✨ Funcionalidades Principais

### 🛒 **Sistema de Carrinho**
- Adição/remoção de produtos
- Controle de quantidade
- Cálculo automático de preços
- Aplicação de cupons de desconto
- Resumo completo do pedido

### 💳 **Sistema de Pagamento PIX**
- Geração automática de QR Code PIX
- Código PIX Copia e Cola
- Confirmação manual de pagamento
- Dashboard administrativo para gestão
- Integração com sistema de reservas

### 📱 **Interface Responsiva**
- Design mobile-first
- Componentes adaptáveis
- Navegação intuitiva
- Animações suaves
- Cores da marca Cookite

### 📧 **Sistema de Notificações**
- Confirmação de pedido por email
- Código de retirada automático
- Notificações de status
- Integração com Resend API

## 🏗️ Arquitetura e Tecnologias

### **Frontend**
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### **Backend & Integrações**
- **Node.js** - Runtime JavaScript
- **Supabase** - Backend-as-a-Service
- **Resend API** - Serviço de emails
- **PIX EMV** - Padrão brasileiro de pagamento

### **Estado e Gerenciamento**
- **React Hooks** - useState, useEffect, useCallback
- **Context API** - Estado global da aplicação
- **LocalStorage** - Persistência local de dados

## 📁 Estrutura do Projeto

```
cookite-jepp/
├── components/                 # Componentes React
│   ├── ui/                    # Componentes base (Shadcn/ui)
│   ├── Hero.tsx              # Seção principal da landing page
│   ├── Products.tsx          # Lista de produtos
│   ├── ShoppingCart.tsx      # Modal do carrinho
│   ├── CheckoutPage.tsx      # Página de finalização
│   ├── PixPaymentPremium.tsx # Sistema de pagamento PIX
│   ├── AdminDashboard.tsx    # Painel administrativo
│   ├── FAQ.tsx               # Perguntas frequentes
│   └── ...
├── hooks/                     # Hooks customizados
│   ├── useReservations.ts    # Lógica de reservas
│   └── useValidation.ts      # Validação de formulários
├── utils/                     # Utilitários e configurações
│   ├── pixAdvanced.ts        # Sistema PIX avançado
│   ├── pixConfig.ts          # Configurações PIX
│   ├── emailAdvanced.ts      # Sistema de emails
│   └── ...
├── styles/                    # Estilos globais
│   └── globals.css           # CSS global e animações
├── lib/                       # Bibliotecas externas
│   └── supabase.ts           # Cliente Supabase
└── public/                    # Arquivos estáticos
```

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional)
- Chave da API Resend (opcional)

### **Instalação**

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd cookite-jepp
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_RESEND_API_KEY=sua_chave_resend
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 🔧 Scripts Disponíveis

```json
{
  "dev": "vite",                    # Servidor de desenvolvimento
  "build": "tsc && vite build",     # Build de produção
  "preview": "vite preview"         # Preview do build
}
```

## 🎨 Sistema de Design

### **Paleta de Cores**
- **Azul Cookite** - `#2563eb` (Cor principal)
- **Amarelo Cookite** - `#fbbf24` (Cor de destaque)
- **Cinza Cookite** - `#f3f4f6` (Cor de fundo)

### **Componentes UI**
- Design system consistente
- Componentes reutilizáveis
- Responsividade mobile-first
- Animações e transições suaves

## 💳 Sistema PIX

### **Funcionalidades**
- Geração de QR Code EMV padrão
- Código PIX Copia e Cola
- Validação de códigos PIX
- Confirmação manual de pagamento
- Dashboard administrativo

### **Padrão EMV**
- Seguindo especificações do Banco Central
- Campos obrigatórios implementados
- CRC16 para validação
- Normalização de texto

## 📧 Sistema de Emails

### **Funcionalidades**
- Confirmação automática de pedidos
- Código de retirada
- Notificações de status
- Templates personalizados
- Integração com Resend API

## 🔐 Funcionalidades de Segurança

- Validação de formulários
- Sanitização de dados
- Controle de acesso administrativo
- Validação de pagamentos PIX
- Proteção contra ataques XSS

## 📱 Responsividade

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Características**
- Design mobile-first
- Componentes adaptáveis
- Navegação otimizada para touch
- Imagens responsivas

## 🧪 Testes e Qualidade

### **TypeScript**
- Tipagem estática completa
- Interfaces bem definidas
- Validação de tipos em tempo de compilação

### **Linting e Formatação**
- ESLint para qualidade de código
- Prettier para formatação
- Husky para hooks de git

## 🚀 Deploy e Produção

### **Build de Produção**
```bash
npm run build
```

### **Arquivos Gerados**
- `dist/` - Arquivos otimizados
- `index.html` - Página principal
- `assets/` - CSS, JS e imagens

### **Plataformas de Deploy**
- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor estático

## 📊 Dashboard Administrativo

### **Funcionalidades**
- Visualização de pedidos
- Gestão de pagamentos PIX
- Estatísticas de vendas
- Controle de status
- Exportação de dados

### **Acesso**
- Interface protegida
- Controle de permissões
- Logs de atividades
- Backup automático

## 🔄 Fluxo de Pedido

1. **Seleção de Produtos** → Adição ao carrinho
2. **Revisão do Pedido** → Confirmação de itens
3. **Dados do Cliente** → Informações de contato
4. **Pagamento PIX** → Geração de QR Code
5. **Confirmação** → Código de retirada
6. **Retirada** → Apresentação do código no evento

## 📈 Métricas e Analytics

### **Dados Coletados**
- Produtos mais vendidos
- Horários de pico
- Taxa de conversão
- Tempo médio de pedido
- Satisfação do cliente

## 🛠️ Manutenção e Suporte

### **Atualizações**
- Dependências atualizadas regularmente
- Correções de bugs
- Melhorias de performance
- Novas funcionalidades

### **Suporte**
- Documentação completa
- Issues no GitHub
- Comunidade ativa
- Suporte técnico

## 📄 Licença

Este projeto é desenvolvido para o evento JEPP e não possui licença comercial.

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor**: Igor
- **Projeto**: Cookite JEPP
- **Evento**: Jornada de Empreendedorismo e Projetos

## 📞 Contato

- **Instagram**: [@cookite_oficial](https://instagram.com/cookite_oficial)
- **Email**: nickaasalomao@gmail.com
- **Projeto**: Sistema de Pedidos Online Cookite JEPP

---

## 🎯 **Resumo Executivo**

O **Cookite JEPP** é uma solução completa de e-commerce desenvolvida especificamente para o evento JEPP, oferecendo:

✅ **Sistema de pedidos online** com carrinho intuitivo  
✅ **Pagamentos PIX** com QR Code e Copia e Cola  
✅ **Interface responsiva** mobile-first  
✅ **Dashboard administrativo** para gestão  
✅ **Sistema de emails** automatizado  
✅ **Segurança e validação** robustas  
✅ **Design consistente** com a marca Cookite  

A plataforma está pronta para produção e pode ser facilmente adaptada para outros eventos similares ou expandida com funcionalidades adicionais.
