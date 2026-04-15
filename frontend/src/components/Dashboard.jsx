import { TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ clientes, stats }) {
  const clientesAtivos = clientes.filter(c => c.status).length;
  const saldoTotal = clientes.reduce((sum, c) => sum + c.saldo_financeiro, 0);
  const saldoBaixo = clientes.filter(c => c.saldo_financeiro < 100).length;

  // Dados para gráfico
  const chartData = clientes
    .sort((a, b) => b.saldo_financeiro - a.saldo_financeiro)
    .slice(0, 5)
    .map(c => ({
      nome: c.nome.split(' ')[0],
      saldo: c.saldo_financeiro,
      limite: c.limite_diario,
      hoje: c.leads_recebidos_hoje
    }));

  return (
    <div className="space-y-8">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clientes Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{clientesAtivos}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Saldo Total</p>
              <p className="text-3xl font-bold text-gray-900">R$ {saldoTotal.toLocaleString('pt-BR')}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Leads Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.leads_distribuidos_hoje || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Saldo Baixo</p>
              <p className="text-3xl font-bold text-gray-900">{saldoBaixo}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-100" />
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 Clientes por Saldo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
            <Legend />
            <Bar dataKey="saldo" fill="#3b82f6" name="Saldo (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clientes com Saldo Baixo */}
      {saldoBaixo > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900">⚠️ Atenção: Clientes com Saldo Baixo</h3>
              <p className="text-yellow-700 text-sm mt-1">
                {saldoBaixo} cliente(s) com saldo abaixo de R$ 100. Recarregue para evitar interrupções.
              </p>
              <div className="mt-2 space-y-1">
                {clientes
                  .filter(c => c.saldo_financeiro < 100 && c.status)
                  .map(c => (
                    <p key={c.id} className="text-sm text-yellow-800">
                      • {c.nome}: R$ {c.saldo_financeiro.toFixed(2)}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
