import { useState } from 'react';
import { Edit2, Power, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ClientesList({ clientes, onRefresh }) {
  const [editando, setEditando] = useState(null);
  const [novoSaldo, setNovoSaldo] = useState('');
  const [novoLimite, setNovoLimite] = useState('');

  const handleAtualizarSaldo = async (id, valor) => {
    try {
      await axios.patch(`${API_URL}/api/clientes/${id}/saldo`, {
        valor: parseFloat(valor)
      });
      setEditando(null);
      setNovoSaldo('');
      onRefresh();
    } catch (error) {
      alert('Erro ao atualizar saldo');
    }
  };

  const handleAtualizarLimite = async (id, limite) => {
    try {
      await axios.patch(`${API_URL}/api/clientes/${id}/limite`, {
        limite_diario: parseInt(limite)
      });
      onRefresh();
    } catch (error) {
      alert('Erro ao atualizar limite');
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/clientes/${id}/status`, {
        status: !status
      });
      onRefresh();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite Diário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hoje</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.map(cliente => {
              const percentualUso = (cliente.leads_recebidos_hoje / cliente.limite_diario) * 100;
              return (
                <tr key={cliente.id} className={`${!cliente.status ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nome}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${cliente.saldo_financeiro < 100 ? 'text-red-600' : 'text-green-600'}`}>
                        R$ {cliente.saldo_financeiro.toFixed(2)}
                      </span>
                      {editando === cliente.id ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={novoSaldo}
                            onChange={(e) => setNovoSaldo(e.target.value)}
                            placeholder="Valor"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => handleAtualizarSaldo(cliente.id, novoSaldo)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditando(cliente.id);
                            setNovoSaldo('');
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{cliente.limite_diario}</span>
                      <input
                        type="number"
                        value={novoLimite || cliente.limite_diario}
                        onChange={(e) => {
                          setNovoLimite(e.target.value);
                          if (e.target.value !== cliente.limite_diario.toString()) {
                            handleAtualizarLimite(cliente.id, e.target.value);
                          }
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{cliente.leads_recebidos_hoje}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${percentualUso > 80 ? 'bg-red-600' : percentualUso > 50 ? 'bg-yellow-600' : 'bg-green-600'}`}
                          style={{ width: `${Math.min(percentualUso, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cliente.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cliente.status ? '✓ Ativo' : '✕ Pausado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(cliente.id, cliente.status)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        cliente.status
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={cliente.status ? 'Pausar cliente' : 'Retomar cliente'}
                    >
                      <Power className="w-4 h-4" />
                      {cliente.status ? 'Pausar' : 'Retomar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {clientes.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum cliente cadastrado ainda</p>
          <p className="text-gray-400 text-sm mt-2">Clique em "Novo Cliente" para adicionar</p>
        </div>
      )}
    </div>
  );
}

export default ClientesList;
