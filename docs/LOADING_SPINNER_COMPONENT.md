# Componente LoadingSpinner

Este documento descreve o componente `LoadingSpinner` reutilizável que oferece diferentes variantes e tamanhos para indicar estados de carregamento na aplicação.

## 🎯 **Características**

- ✅ **Múltiplas Variantes**: Spinner circular, dots animados, pulse
- ✅ **Diferentes Tamanhos**: Small, Medium, Large
- ✅ **Cores Personalizáveis**: Azul, verde, vermelho, amarelo, roxo, cinza
- ✅ **Componentes Especializados**: Para botões, páginas, seções
- ✅ **Acessibilidade**: ARIA labels e roles apropriados
- ✅ **Responsivo**: Adapta-se a diferentes contextos

## 🔧 **Componentes Disponíveis**

### **1. LoadingSpinner (Principal)**
Componente base com todas as opções de personalização.

### **2. Componentes Especializados por Tamanho**
- `LoadingSpinnerSmall` - Tamanho pequeno (16x16px)
- `LoadingSpinnerMedium` - Tamanho médio (24x24px)
- `LoadingSpinnerLarge` - Tamanho grande (32x32px)

### **3. Componentes Contextuais**
- `LoadingSpinnerWithText` - Com texto posicionável
- `ButtonLoadingSpinner` - Otimizado para botões
- `PageLoadingSpinner` - Para páginas inteiras
- `SectionLoadingSpinner` - Para seções de conteúdo
- `InlineLoadingSpinner` - Para texto inline

## 🚀 **Como Usar**

### **Uso Básico**

```tsx
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <div>
      {/* Spinner padrão */}
      <LoadingSpinner />
      
      {/* Com tamanho específico */}
      <LoadingSpinner size="lg" />
      
      {/* Com cor personalizada */}
      <LoadingSpinner color="green" />
      
      {/* Com variante específica */}
      <LoadingSpinner variant="dots" />
    </div>
  );
}
```

### **Componentes Especializados**

```tsx
import { 
  LoadingSpinnerSmall, 
  LoadingSpinnerMedium, 
  LoadingSpinnerLarge 
} from '../components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <div className="space-y-4">
      <LoadingSpinnerSmall color="blue" />
      <LoadingSpinnerMedium color="green" />
      <LoadingSpinnerLarge color="purple" />
    </div>
  );
}
```

### **Loading com Texto**

```tsx
import { LoadingSpinnerWithText } from '../components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <div className="space-y-4">
      {/* Texto abaixo (padrão) */}
      <LoadingSpinnerWithText text="Carregando dados..." />
      
      {/* Texto acima */}
      <LoadingSpinnerWithText 
        text="Processando..." 
        textPosition="top" 
      />
      
      {/* Texto à direita */}
      <LoadingSpinnerWithText 
        text="Aguarde..." 
        textPosition="right" 
      />
      
      {/* Com personalizações */}
      <LoadingSpinnerWithText 
        text="Salvando..."
        size="lg"
        color="green"
        variant="pulse"
      />
    </div>
  );
}
```

### **Loading para Botões**

```tsx
import { ButtonLoadingSpinner } from '../components/ui/LoadingSpinner';

function MyButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <ButtonLoadingSpinner size="sm" />
          <span>Processando...</span>
        </div>
      ) : (
        'Clique aqui'
      )}
    </button>
  );
}
```

### **Loading para Páginas**

```tsx
import { PageLoadingSpinner } from '../components/ui/LoadingSpinner';

function MyPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <PageLoadingSpinner 
        text="Carregando página..." 
        className="min-h-screen"
      />
    );
  }

  return <div>Conteúdo da página</div>;
}
```

### **Loading para Seções**

```tsx
import { SectionLoadingSpinner } from '../components/ui/LoadingSpinner';

function MySection() {
  const [loading, setLoading] = useState(false);

  return (
    <section className="p-6">
      <h2>Minha Seção</h2>
      
      {loading ? (
        <SectionLoadingSpinner text="Carregando dados da seção..." />
      ) : (
        <div>Conteúdo da seção</div>
      )}
    </section>
  );
}
```

### **Loading Inline**

```tsx
import { InlineLoadingSpinner } from '../components/ui/LoadingSpinner';

function MyText() {
  const [loading, setLoading] = useState(false);

  return (
    <p>
      Status: {loading ? (
        <InlineLoadingSpinner text="Verificando..." />
      ) : (
        'Conectado'
      )}
    </p>
  );
}
```

## 🎨 **Variantes Disponíveis**

### **1. Default (Circular)**
```tsx
<LoadingSpinner variant="default" />
```
- Spinner circular girando
- Borda cinza com ponta colorida
- Animação `animate-spin`

### **2. Dots (Pontos)**
```tsx
<LoadingSpinner variant="dots" />
```
- Três pontos animados
- Animação `animate-bounce` com delays
- Espaçamento automático

### **3. Pulse (Pulsante)**
```tsx
<LoadingSpinner variant="pulse" />
```
- Círculo pulsante
- Animação `animate-pulse`
- Cor sólida

## 📏 **Tamanhos Disponíveis**

### **Small (sm)**
- **Dimensões**: 16x16px (`h-4 w-4`)
- **Uso**: Botões pequenos, texto inline, ícones

### **Medium (md)**
- **Dimensões**: 24x24px (`h-6 w-6`)
- **Uso**: Botões padrão, seções, formulários

### **Large (lg)**
- **Dimensões**: 32x32px (`h-8 w-8`)
- **Uso**: Páginas inteiras, modais, áreas principais

## 🌈 **Cores Disponíveis**

### **Paleta de Cores**
- **blue**: `border-t-blue-600` (padrão)
- **green**: `border-t-green-600`
- **red**: `border-t-red-600`
- **yellow**: `border-t-yellow-600`
- **purple**: `border-t-purple-600`
- **gray**: `border-t-gray-600`

### **Uso Contextual**
```tsx
// Sucesso
<LoadingSpinner color="green" />

// Erro
<LoadingSpinner color="red" />

// Aviso
<LoadingSpinner color="yellow" />

// Informação
<LoadingSpinner color="blue" />
```

## ♿ **Acessibilidade**

### **ARIA Labels**
- `role="status"` para indicar estado
- `aria-label="Carregando..."` para leitores de tela
- Suporte a tecnologias assistivas

### **Semântica**
- Componentes semânticos apropriados
- Estados visuais claros
- Contraste adequado

## 🎯 **Casos de Uso Comuns**

### **1. Formulários**
```tsx
function LoginForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <ButtonLoadingSpinner size="sm" />
            <span>Entrando...</span>
          </div>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
}
```

### **2. Listas e Tabelas**
```tsx
function DataTable() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="p-8">
        <SectionLoadingSpinner text="Carregando dados da tabela..." />
      </div>
    );
  }

  return (
    <table>
      {/* Conteúdo da tabela */}
    </table>
  );
}
```

### **3. Modais e Overlays**
```tsx
function Modal() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="modal">
      <div className="modal-content">
        {loading ? (
          <div className="py-12">
            <LoadingSpinnerWithText 
              text="Processando solicitação..."
              size="lg"
              color="blue"
            />
          </div>
        ) : (
          <div>Conteúdo do modal</div>
        )}
      </div>
    </div>
  );
}
```

### **4. Navegação**
```tsx
function Navigation() {
  const [loading, setLoading] = useState(false);

  return (
    <nav>
      <div className="flex items-center space-x-4">
        <span>Menu</span>
        {loading && <LoadingSpinnerSmall color="gray" />}
      </div>
    </nav>
  );
}
```

## 🔧 **Personalização Avançada**

### **Classes CSS Customizadas**
```tsx
<LoadingSpinner 
  className="border-4 border-gray-200 border-t-indigo-500"
  size="lg"
/>
```

### **Estilos Inline**
```tsx
<LoadingSpinner 
  style={{ 
    borderWidth: '3px',
    borderTopColor: '#8b5cf6'
  }}
  size="md"
/>
```

### **Tema Escuro**
```tsx
<LoadingSpinner 
  className="dark:border-gray-600 dark:border-t-blue-400"
  color="blue"
/>
```

## 📱 **Responsividade**

### **Tamanhos Adaptativos**
```tsx
function ResponsiveLoading() {
  return (
    <div className="flex justify-center">
      <LoadingSpinner 
        size="sm"
        className="md:hidden" // Pequeno no mobile
      />
      <LoadingSpinner 
        size="md"
        className="hidden md:block lg:hidden" // Médio no tablet
      />
      <LoadingSpinner 
        size="lg"
        className="hidden lg:block" // Grande no desktop
      />
    </div>
  );
}
```

## 🚨 **Troubleshooting**

### **Problema: Spinner não aparece**
```tsx
// Verifique se as classes Tailwind estão disponíveis
<LoadingSpinner className="animate-spin" />

// Verifique se não há conflitos de CSS
<LoadingSpinner className="!animate-spin" />
```

### **Problema: Tamanho incorreto**
```tsx
// Force o tamanho com classes customizadas
<LoadingSpinner 
  size="lg"
  className="!h-8 !w-8"
/>
```

### **Problema: Cor não aplicada**
```tsx
// Use classes customizadas para cores específicas
<LoadingSpinner 
  className="border-t-custom-color"
  color="blue" // Será sobrescrito
/>
```

## 🔄 **Próximas Melhorias**

### **Funcionalidades Planejadas**
- [ ] **Skeleton Loading**: Para conteúdo estruturado
- [ ] **Progress Bar**: Com percentual de progresso
- [ ] **Wave Animation**: Para listas e cards
- [ ] **Shimmer Effect**: Para conteúdo em carregamento
- [ ] **Custom Animations**: Animações CSS personalizadas

### **Otimizações**
- [ ] **Lazy Loading**: Carregar apenas quando necessário
- [ ] **Performance**: Otimizar re-renders
- [ ] **Bundle Size**: Reduzir tamanho do bundle
- [ ] **Tree Shaking**: Suporte a tree shaking

## 📋 **Checklist de Implementação**

- [ ] **Componente Base**: Implementar `LoadingSpinner`
- [ ] **Variantes**: Adicionar dots e pulse
- [ ] **Tamanhos**: Implementar small, medium, large
- [ ] **Cores**: Adicionar paleta de cores
- [ ] **Componentes Especializados**: Criar variantes contextuais
- [ ] **Acessibilidade**: Adicionar ARIA labels
- [ ] **Documentação**: Documentar uso e exemplos
- [ ] **Testes**: Testar diferentes cenários

---

**Componente LoadingSpinner Implementado com Sucesso! 🎉**

Agora você tem um sistema completo de loading spinners para toda a aplicação!
