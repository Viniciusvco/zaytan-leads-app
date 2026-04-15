import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function LeadsHistory() {
  const [leads, setLeads] = useState([]);
  const [aba, setAba] = useState('distribuidos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLeads();
    const intervalo = setInterval(carregarLeads, 10000);
    return () => clearInterval(intervalo);
  }, [aba]);

  const carregarLeads = async () => {
    try {
      const url = aba === 'distribuidos' ? `${API_URL}/api/leads` : `${API_URL}/api/transbordo`;
      const res = await axios.get(url);
      setLeads(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Abas */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setAba('distribuidos')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            aba === 'distribuidos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          ✓ Distribuídos ({leads.filter(l => !l.motivo).length})
        </button>
        <button
          onClick={() => setAba('transbordo')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            aba === 'transbordo'
              ? 'border-yellow-600 text-yellow-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          ⚠️ Transbordo ({leads.filter(l => l.motivo).length})
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Carregando leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nenhum lead {aba === 'distribuidos' ? 'distribuído' : 'em transbordo'} ainda
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                {aba === 'distribuidos' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                )}
                {aba === 'transbordo' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.slice(0, 50).map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{lead.lead_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.telefone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.tipo_financiamento || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    R$ {lead.valor_parcela?.toFixed(2) || '-'}
                  </td>
                  {aba === 'distribuidos' && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.clientes?.nome || '-'}
                    </td>
                  )}
                  {aba === 'transbordo' && (
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {lead.motivo}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(lead.data_distribuicao || lead.data_transbordo).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeadsHistory;
