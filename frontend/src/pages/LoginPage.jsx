import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

const ADMIN_EMAIL = 'vinicius.ap202@gmail.com';
const ADMIN_PASSWORD = 'vini9500';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de login
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Login bem-sucedido
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminEmail', email);
        onLogin();
      } else {
        // Login falhou
        setError('❌ Email ou senha incorretos. Tente novamente.');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header com Brand */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-12 text-center">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 100 100"
                  className="w-12 h-12 text-orange-600"
                  fill="currentColor"
                >
                  <path d="M30 20 Q40 30 35 50 Q30 70 50 80 Q70 90 80 70 Q85 50 75 40 Q65 30 50 35" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Zaytan</h1>
            <p className="text-orange-100 text-sm">Lead Manager</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-gray-600 text-center mb-8 text-sm">
              Acesso Restrito - Admin
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-orange-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vinicius.ap202@gmail.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-orange-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Botão Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 transition duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? '🔄 Entrando...' : '🔐 Acessar Dashboard'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Acesso restrito a administradores</p>
              <p className="mt-2">Desenvolvido para Zaytan Marketing</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-orange-50 text-sm">
          <p>🔒 Sistema de Distribuição de Leads</p>
        </div>
      </div>
    </div>
  );
}
