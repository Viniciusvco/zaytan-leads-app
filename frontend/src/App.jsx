import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Power, Zap, TrendingUp, Users, DollarSign } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClientesList from './components/ClientesList';
import LeadsHistory from './components/LeadsHistory';
import ModalNovoCliente from './components/ModalNovoCliente';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [aba, setAba] = useState('dashboard');
  const [clientes, setClientes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalNovoCliente, setShowModalNovoCliente] = useState(false);

  // Carregar dados
  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(carregarDados, 5000); // Atualizar a cada 5s
    return () => clearInterval(intervalo);
  }, []);

  const carregarDados = async () => {
    try {
      const [clientesRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/clientes`),
        axios.get(`${API_URL}/api/stats`)
      ]);

      setClientes(clientesRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleNovoCliente = async (dados) => {
    try {
      await axios.post(`${API_URL}/api/clientes`, dados);
      setShowModalNovoCliente(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando Zaytan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Zaytan Lead Manager</h1>
                <p className="text-blue-100 text-sm">Distribuição inteligente de leads</p>
              </div>
            </div>
            <div className="text-right text-sm text-blue-100">
              <p>Admin: Vinicius</p>
              <p>vinicius.ap202@gmail.com</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex gap-8">
              <button
                onClick={() => setAba('dashboard')}
                className={`px-1 py-2 border-b-2 font-medium text-sm transition-colors ${
                  aba === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setAba('clientes')}
                className={`px-1 py-2 border-b-2 font-medium text-sm transition-colors ${
                  aba === 'clientes'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                👥 Clientes
              </button>
              <button
                onClick={() => setAba('leads')}
                className={`px-1 py-2 border-b-2 font-medium text-sm transition-colors ${
                  aba === 'leads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Leads
              </button>
            </div>

            <button
              onClick={() => setShowModalNovoCliente(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Cliente
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {aba === 'dashboard' && <Dashboard clientes={clientes} stats={stats} />}
        {aba === 'clientes' && <ClientesList clientes={clientes} onRefresh={carregarDados} />}
        {aba === 'leads' && <LeadsHistory />}
      </main>

      {/* Modal Novo Cliente */}
      {showModalNovoCliente && (
        <ModalNovoCliente
          onClose={() => setShowModalNovoCliente(false)}
          onSubmit={handleNovoCliente}
        />
      )}
    </div>
  );
}

export default App;
