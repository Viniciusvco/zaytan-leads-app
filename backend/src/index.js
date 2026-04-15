import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ============================================================
// ROTAS
// ============================================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================================
// TEST: Verificar tabelas e schema
// ============================================================
app.get('/test/tables', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .limit(1);

    if (error) {
      return res.json({
        status: 'ERROR',
        message: error.message,
        error: error.code
      });
    }

    res.json({
      status: 'OK',
      message: 'Tabela clientes existe',
      sampleData: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// ============================================================
// WEBHOOK: Receber Lead do Meta Ads
// ============================================================
app.post('/webhook/leads', async (req, res) => {
  try {
    const { id_lead, nome, telefone, email, tipo_financiamento, valor_parcela } = req.body;

    // Validar dados
    if (!id_lead || !nome || !telefone) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    // 1. Buscar clientes disponíveis
    const { data: clientes, error: erroClientes } = await supabase
      .from('clientes')
      .select('*')
      .eq('status', true)
      .gte('saldo_financeiro', 20)
      .lt('leads_recebidos_hoje', supabase.rpc('get_limite_diario'))
      .order('saldo_financeiro', { ascending: false })
      .limit(1);

    if (erroClientes) {
      console.error('Erro ao buscar clientes:', erroClientes);
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }

    // 2. Verificar se há cliente disponível
    if (!clientes || clientes.length === 0) {
      // Enviar para transbordo
      await supabase
        .from('leads_transbordo')
        .insert([
          {
            lead_id: id_lead,
            nome,
            telefone,
            email,
            tipo_financiamento,
            valor_parcela,
            motivo: 'Nenhum cliente disponível'
          }
        ]);

      return res.json({
        status: 'overflow',
        message: 'Lead enviado para transbordo',
        lead_id: id_lead
      });
    }

    const clienteSelecionado = clientes[0];

    // 3. Atualizar saldo e contador
    const { error: erroUpdate } = await supabase
      .from('clientes')
      .update({
        saldo_financeiro: clienteSelecionado.saldo_financeiro - 20,
        leads_recebidos_hoje: clienteSelecionado.leads_recebidos_hoje + 1
      })
      .eq('id', clienteSelecionado.id);

    if (erroUpdate) {
      console.error('Erro ao atualizar saldo:', erroUpdate);
      return res.status(500).json({ error: 'Erro ao atualizar saldo' });
    }

    // 4. Registrar em auditoria
    const { error: erroAuditoria } = await supabase
      .from('leads_distribuidos')
      .insert([
        {
          cliente_id: clienteSelecionado.id,
          lead_id: id_lead,
          nome,
          telefone,
          email,
          tipo_financiamento,
          valor_parcela
        }
      ]);

    if (erroAuditoria) {
      console.error('Erro ao registrar auditoria:', erroAuditoria);
    }

    // 5. Entregar em Google Sheets (se necessário)
    if (clienteSelecionado.spreadsheet_id) {
      // TODO: Implementar integração Google Sheets
      console.log(`Inserindo em Google Sheets: ${clienteSelecionado.spreadsheet_id}`);
    }

    // Sucesso!
    return res.json({
      status: 'success',
      message: 'Lead distribuído com sucesso',
      lead_id: id_lead,
      cliente: clienteSelecionado.nome,
      saldo_atual: clienteSelecionado.saldo_financeiro - 20
    });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro ao processar lead' });
  }
});

// ============================================================
// API: Listar Clientes
// ============================================================
app.get('/api/clientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('saldo_financeiro', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

// ============================================================
// API: Obter Cliente por ID
// ============================================================
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: 'Erro ao obter cliente' });
  }
});

// ============================================================
// API: Criar Cliente
// ============================================================
app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, saldo_financeiro, limite_diario, spreadsheet_id } = req.body;

    // Validar dados obrigatórios
    if (!nome || saldo_financeiro == null || limite_diario == null) {
      return res.status(400).json({ error: 'Nome, saldo e limite são obrigatórios' });
    }

    const novoCliente = {
      nome: String(nome).trim(),
      saldo_financeiro: parseFloat(saldo_financeiro),
      limite_diario: parseInt(limite_diario),
      spreadsheet_id: (spreadsheet_id && String(spreadsheet_id).trim()) || null,
      status: true,
      leads_recebidos_hoje: 0
    };

    console.log('Inserindo cliente:', novoCliente);

    // Inserir apenas
    const { error: insertError } = await supabase
      .from('clientes')
      .insert([novoCliente]);

    if (insertError) {
      console.error('Erro ao inserir:', insertError);
      throw insertError;
    }

    // Buscar o cliente criado
    const { data: clientes, error: selectError } = await supabase
      .from('clientes')
      .select('*')
      .eq('nome', novoCliente.nome)
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError || !clientes || clientes.length === 0) {
      console.error('Erro ao buscar cliente criado:', selectError);
      return res.status(201).json({ status: 'created', message: 'Cliente criado com sucesso' });
    }

    res.status(201).json(clientes[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
  }
});

// ============================================================
// API: Atualizar Saldo
// ============================================================
app.patch('/api/clientes/:id/saldo', async (req, res) => {
  try {
    const { valor } = req.body;

    // Buscar saldo atual
    const { data: cliente, error: erroGet } = await supabase
      .from('clientes')
      .select('saldo_financeiro')
      .eq('id', req.params.id)
      .single();

    if (erroGet) throw erroGet;

    const novoSaldo = cliente.saldo_financeiro + valor;

    const { data, error } = await supabase
      .from('clientes')
      .update({ saldo_financeiro: novoSaldo })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    res.status(500).json({ error: 'Erro ao atualizar saldo' });
  }
});

// ============================================================
// API: Pausar/Retomar Cliente
// ============================================================
app.patch('/api/clientes/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('clientes')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// ============================================================
// API: Atualizar Limite Diário
// ============================================================
app.patch('/api/clientes/:id/limite', async (req, res) => {
  try {
    const { limite_diario } = req.body;

    const { data, error } = await supabase
      .from('clientes')
      .update({ limite_diario })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar limite:', error);
    res.status(500).json({ error: 'Erro ao atualizar limite' });
  }
});

// ============================================================
// API: Listar Leads Distribuídos
// ============================================================
app.get('/api/leads', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads_distribuidos')
      .select(`
        *,
        clientes:cliente_id(nome)
      `)
      .order('data_distribuicao', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao listar leads:', error);
    res.status(500).json({ error: 'Erro ao listar leads' });
  }
});

// ============================================================
// API: Listar Leads em Transbordo
// ============================================================
app.get('/api/transbordo', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads_transbordo')
      .select('*')
      .order('data_transbordo', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao listar transbordo:', error);
    res.status(500).json({ error: 'Erro ao listar transbordo' });
  }
});

// ============================================================
// API: Dashboard Stats
// ============================================================
app.get('/api/stats', async (req, res) => {
  try {
    // Total de clientes
    const { data: clientes } = await supabase
      .from('clientes')
      .select('count', { count: 'exact' });

    // Saldo total
    const { data: saldoData } = await supabase
      .from('clientes')
      .select('saldo_financeiro');

    const saldoTotal = saldoData?.reduce((acc, c) => acc + c.saldo_financeiro, 0) || 0;

    // Leads hoje
    const { data: leadsHoje } = await supabase
      .from('leads_distribuidos')
      .select('count', { count: 'exact', eq: 'data_distribuicao' });

    res.json({
      total_clientes: clientes?.[0]?.count || 0,
      saldo_total: saldoTotal,
      leads_distribuidos_hoje: leadsHoje?.[0]?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao obter stats:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   ZAYTAN LEAD MANAGER - BACKEND       ║
║   Servidor rodando em porta ${PORT}       ║
║   http://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `);
});
