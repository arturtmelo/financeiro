import { useState } from 'react';
import {
  LogIn,
  Mail,
  Lock,
  UserPlus,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  BarChart3,
  PiggyBank,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

type Mode = 'login' | 'register' | 'forgot';

const FEATURES = [
  { icon: BarChart3, text: 'Dashboards e gráficos interativos' },
  { icon: PiggyBank, text: 'Orçamentos por categoria com alertas' },
  { icon: Moon, text: 'Modo escuro e app instalável (PWA)' },
];

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Fraca', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Média', color: 'bg-amber-500' };
  return { score, label: 'Forte', color: 'bg-green-500' };
};

const Login = () => {
  const { login, register, resetPassword, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData((prev) => ({ name: '', email: prev.email, password: '', confirmPassword: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const result = await resetPassword(formData.email);
        setLoading(false);
        if (result.success) {
          showToast(result.message, 'success');
          switchMode('login');
        } else {
          setError(result.message);
        }
        return;
      }

      if (mode === 'register') {
        // Validações para registro
        if (!formData.name.trim()) {
          setError('Por favor, informe seu nome.');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }

        const result = await register(formData.name, formData.email, formData.password);
        if (!result.success) {
          setError(result.message);
          setLoading(false);
        }
      } else {
        // Login
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.message);
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    showToast('Modo demo ativado! Explore o app com dados fictícios.', 'info');
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const titles: Record<Mode, { title: string; subtitle: string }> = {
    login: { title: 'Entrar', subtitle: 'Acesse sua conta para continuar' },
    register: { title: 'Criar Conta', subtitle: 'Leva menos de um minuto' },
    forgot: { title: 'Recuperar Senha', subtitle: 'Enviaremos um link para o seu email' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 animate-fadeIn">
        {/* Painel de marca (apenas desktop) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-10 text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Finanças</h1>
          <p className="text-white/80 mb-8">
            Controle suas finanças pessoais de forma simples, visual e no seu ritmo.
          </p>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="bg-white/15 p-2 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-white/90 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Painel do formulário */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo (apenas mobile) */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-3">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finanças</h1>
          </div>

          {mode === 'forgot' && (
            <button
              onClick={() => switchMode('login')}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium mb-4 -ml-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {titles[mode].title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{titles[mode].subtitle}</p>

          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome (apenas no registro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                  autoFocus
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Senha (login e registro) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Senha *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {mode === 'register' && formData.password && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Força da senha: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Confirmar Senha (apenas no registro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              {loading ? (
                <span>Aguarde...</span>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </>
              ) : mode === 'forgot' ? (
                <>
                  <KeyRound className="w-5 h-5" />
                  Enviar link
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500">ou</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 font-semibold rounded-xl transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Continuar como visitante (modo demo)
              </button>

              {/* Toggle entre Login e Registro */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {mode === 'register' ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                  <button
                    onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold underline"
                  >
                    {mode === 'register' ? 'Fazer login' : 'Criar conta'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
