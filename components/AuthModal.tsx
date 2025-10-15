import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAdminLogin?: () => void
}

export const AuthModal = ({ isOpen, onClose, onAdminLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const validateBasic = () => {
    if (!formData.email) return 'Email é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido'
    if (!formData.password) return 'Senha é obrigatória'
    if (!isLogin && !formData.name) return 'Nome é obrigatório'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validationError = validateBasic()
      if (validationError) {
        toast.error(validationError)
        return
      }

      if (isLogin) {
        const result = await signIn(formData.email, formData.password)
        if (result.success) {
          // Verificar se é admin (case-insensitive e trim)
          const emailLower = formData.email.toLowerCase().trim()
          console.log('🔍 [AUTH] Verificando se é admin...')
          console.log('🔍 [AUTH] Email digitado:', formData.email)
          console.log('🔍 [AUTH] Email normalizado:', emailLower)
          console.log('🔍 [AUTH] Comparando com: admin@cookittie.com')
          console.log('🔍 [AUTH] É admin?', emailLower === 'admin@cookittie.com')
          
          if (emailLower === 'admin@cookittie.com') {
            console.log('✅ [AUTH] É ADMIN! Redirecionando para painel...')
            toast.success('Bem-vindo, Admin! 👑', {
              duration: 3000,
              icon: '👑'
            })
            setFormData({ email: '', password: '', name: '', phone: '' })
            
            // Redirecionar para painel admin
            if (onAdminLogin) {
              console.log('📍 [AUTH] Chamando onAdminLogin...')
              onAdminLogin()
              console.log('✅ [AUTH] onAdminLogin chamado com sucesso!')
            } else {
              console.error('❌ [AUTH] ERRO: onAdminLogin não existe!')
            }
            
            // Fechar modal após redirecionar
            setTimeout(() => {
              console.log('🚪 [AUTH] Fechando modal...')
              onClose()
            }, 200)
          } else {
            console.log('ℹ️ [AUTH] Usuário normal - mantendo na página principal')
            toast.success('Bem-vindo de volta! 🍪')
            onClose()
            setFormData({ email: '', password: '', name: '', phone: '' })
          }
        } else {
          toast.error(result.error || 'Erro no login')
        }
      } else {
        const result = await signUp(formData.email, formData.password, formData.name, formData.phone)
        if (result.success) {
          toast.success('Conta criada com sucesso! 🎉')
          onClose()
          setFormData({ email: '', password: '', name: '', phone: '' })
        } else {
          toast.error(result.error || 'Erro no cadastro')
        }
      }
    } catch (error) {
      console.error('Erro no formulário:', error)
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="cookitie-card w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 cookitie-blob opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 cookitie-blob-2 opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/imagens/logo-2.png" 
                  alt="Cookittie Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    console.log('Erro ao carregar logo-2.png');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="font-cookitie text-xl font-bold text-gray-900">
                  {isLogin ? 'Entrar na Cookitie' : 'Junte-se à Cookitie'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isLogin ? 'Que bom te ver de novo!' : 'Vamos adoçar sua vida!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Nome</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                  <User size={16} className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="flex-1 outline-none bg-transparent"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="voce@email.com"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Senha</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <Lock size={16} className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Telefone (opcional)</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                  <Phone size={16} className="text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="flex-1 outline-none bg-transparent"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cookitie-primary"
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-gray-600 hover:text-gray-800 mt-2"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </button>

            <div className="flex items-center justify-center text-xs text-gray-500 mt-3">
              <Heart size={12} className="mr-1" />
              Sua sessão é persistida com PocketBase.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}