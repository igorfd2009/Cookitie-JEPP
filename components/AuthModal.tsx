import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password)
        if (result.success) {
          toast.success('Bem-vindo de volta! 🍪', {
            style: {
              background: 'linear-gradient(135deg, #e0f0ff 0%, #fff5b8 100%)',
              border: '1px solid #b8e0ff',
              color: '#374151'
            }
          })
          onClose()
          setFormData({ email: '', password: '', name: '', phone: '' })
        } else {
          toast.error(result.error || 'Erro no login')
        }
      } else {
        const result = await signUp(formData.email, formData.password, formData.name, formData.phone)
        if (result.success) {
          toast.success('Conta criada com sucesso! Bem-vindo à Cookitie! 🎉', {
            style: {
              background: 'linear-gradient(135deg, #e0f0ff 0%, #fff5b8 100%)',
              border: '1px solid #b8e0ff',
              color: '#374151'
            }
          })
          onClose()
          setFormData({ email: '', password: '', name: '', phone: '' })
        } else {
          toast.error(result.error || 'Erro no cadastro')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="cookitie-card w-full max-w-md relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-20 h-20 cookitie-blob opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 cookitie-blob-2 opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-yellow-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🍪</span>
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
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 font-cookitie">
                    Nome Completo ✨
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="cookitie-input w-full pl-10 pr-3 py-3"
                      placeholder="Como você gostaria de ser chamado?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 font-cookitie">
                    Telefone (opcional) 📱
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="cookitie-input w-full pl-10 pr-3 py-3"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-cookitie">
                Email 📧
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="cookitie-input w-full pl-10 pr-3 py-3"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-cookitie">
                Senha 🔒
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="cookitie-input w-full pl-10 pr-3 py-3"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres para manter sua conta segura 🛡️
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cookitie-primary py-3 text-base font-cookitie disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  <Heart size={16} className="text-red-300" />
                  {isLogin ? 'Entrar na Cookitie' : 'Criar minha conta'}
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-blue-100">
              <p className="text-sm text-gray-600 mb-3">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já faz parte da família Cookitie?'}
              </p>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium font-cookitie transition-colors"
              >
                {isLogin ? 'Cadastre-se gratuitamente 🎉' : 'Fazer login 🍪'}
              </button>
            </div>
          </form>

          {/* Mensagem de boas-vindas */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-cookitie font-medium">💫 Seja bem-vindo à nossa família!</span>
                <br />
                Desfrute dos nossos doces feitos com muito carinho pelos jovens da Cookitie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}