import { X } from 'lucide-react';
import { useState } from 'react';

function ModalNovoCliente({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    saldo_financeiro: 100,
    limite_diario: 10,
    spreadsheet_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'saldo_financeiro' || name === 'limite_diario'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      if (!formData.nome.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (formData.saldo_financeiro < 20) {
        throw new Error('Saldo mínimo: R$ 20');
      }
      if (formData.limite_diario < 1) {
        throw new Error('Limite mínimo: 1 lead/dia');
      }

      await onSubmit(formData);
      setFormData({ nome: '', saldo_financeiro: 100, limite_diario: 10, spreadsheet_id: '' });
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Novo Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Cliente A - Revisional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Inicial (R$) *
            </label>
            <input
              type="number"
              name="saldo_financeiro"
              value={formData.saldo_financeiro}
              onChange={handleChange}
              min="20"
              step="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo: R$ 20</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limite Diário (leads/dia) *
            </label>
            <input
              type="number"
              name="limite_diario"
              value={formData.limite_diario}
              onChange={handleChange}
              min="1"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Máximo de leads que esse cliente pode receber por dia</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Sheets ID (Opcional)
            </label>
            <input
              type="text"
              name="spreadsheet_id"
              value={formData.spreadsheet_id}
              onChange={handleChange}
              placeholder="Ex: 1A2B3C4D5E6F7G8H9I0J"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Copie do URL: docs.google.com/spreadsheets/d/<strong>ID</strong>/
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            💡 Dica: Você pode editar esses dados depois no dashboard
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Criando...' : 'Criar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalNovoCliente;
