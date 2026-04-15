# 🚀 ZAYTAN LEAD MANAGER

Sistema profissional de **distribuição inteligente de leads** com dashboard em tempo real.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)
![React](https://img.shields.io/badge/react-18%2B-61dafb)

---

## 📊 O QUE É

Uma plataforma web completa que:

✅ **Recebe leads** via webhook (Meta Ads, Zapier, etc)
✅ **Distribui automaticamente** entre múltiplos clientes
✅ **Controla saldo** - CPL fixo de R$ 20/lead
✅ **Respeita limites** - Máximo de leads/dia por cliente
✅ **Dashboard em tempo real** - Métricas e gráficos
✅ **Google Sheets automático** - Entrega em planilhas
✅ **Auditoria 100%** - Histórico completo
✅ **Fallback inteligente** - Transbordo automático

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────┐
│        ZAYTAN LEAD MANAGER              │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (React + Vite)                │
│  ├─ Dashboard com gráficos              │
│  ├─ Gerenciar clientes                  │
│  ├─ Ver leads distribuídos              │
│  └─ Deploy: Vercel                      │
│                                         │
│  Backend (Node.js + Express)            │
│  ├─ API REST                            │
│  ├─ Webhook /leads                      │
│  ├─ Lógica de distribuição              │
│  └─ Deploy: Railway                     │
│                                         │
│  Database (Supabase/PostgreSQL)         │
│  ├─ clientes (saldo, limite, status)    │
│  ├─ leads_distribuidos (auditoria)      │
│  └─ leads_transbordo (fallback)         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚀 QUICK START

### Opção 1: Deploy Imediato (Recomendado)

Siga **[README_DEPLOY.md](./README_DEPLOY.md)**

```bash
1. Conectar GitHub a Vercel + Railway
2. Adicionar variáveis de ambiente
3. Deploy automático
4. Pronto!
```

### Opção 2: Rodar Localmente

```bash
# 1. Clone e entre no diretório
git clone <seu-repo>
cd zaytan-leads-app

# 2. Instale dependências
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# 3. Configure .env
cp .env.example .env
# Edite .env com suas credenciais Supabase

# 4. Rode localmente
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📁 ESTRUTURA DO PROJETO

```
zaytan-leads-app/
├─ frontend/               React + Vite
│  ├─ src/
│  │  ├─ components/       Dashboard, Clientes, Leads
│  │  ├─ App.jsx
│  │  └─ index.css         TailwindCSS
│  ├─ vite.config.js
│  ├─ package.json
│  └─ Dockerfile
│
├─ backend/                Node.js + Express
│  ├─ src/
│  │  └─ index.js          API REST + Webhooks
│  ├─ package.json
│  └─ Dockerfile
│
├─ .env.example            Variáveis de ambiente
├─ docker-compose.yml      Para rodar tudo local
├─ vercel.json             Config deploy Vercel
├─ railway.json            Config deploy Railway
├─ README.md               Este arquivo
└─ README_DEPLOY.md        Instruções detalhadas
```

---

## 🔑 FEATURES

### Dashboard
- 📊 Métricas em tempo real
- 📈 Gráficos de distribuição
- ⚠️ Alertas de saldo baixo
- 🔄 Atualização automática a cada 5s

### Gerenciamento de Clientes
- ➕ Adicionar novo cliente
- 💰 Atualizar saldo (recarregar)
- ⏱️ Mudar limite diário
- ⏸️ Pausar/retomar cliente

### Histórico de Leads
- ✓ Leads distribuídos (com cliente)
- ⚠️ Leads em transbordo
- 📅 Data e hora de cada lead
- 🔍 Buscar por ID

---

## 📡 API ENDPOINTS

### Leads
```
POST   /webhook/leads           Receber lead (Meta Ads)
GET    /api/leads               Listar distribuídos
GET    /api/transbordo          Listar transbordo
```

### Clientes
```
GET    /api/clientes            Listar todos
GET    /api/clientes/:id        Obter um
POST   /api/clientes            Criar novo
PATCH  /api/clientes/:id/saldo  Atualizar saldo
PATCH  /api/clientes/:id/limite Alterar limite
PATCH  /api/clientes/:id/status Pausar/retomar
```

### Sistema
```
GET    /health                  Health check
GET    /api/stats               Estatísticas gerais
```

---

## 🔗 INTEGRAÇÃO WEBHOOK

Meta Ads envia lead para:

```
POST https://zaytan-backend.railway.app/webhook/leads

Body:
{
  "id_lead": "LEAD_001",
  "nome": "João Silva",
  "telefone": "11987654321",
  "email": "joao@email.com",
  "tipo_financiamento": "Revisional",
  "valor_parcela": 2500.00
}
```

---

## 💾 BANCO DE DADOS

### Tabela: clientes
```sql
id                UUID PRIMARY KEY
nome              TEXT
saldo_financeiro  NUMERIC (R$)
limite_diario     INTEGER
leads_recebidos_hoje INTEGER
spreadsheet_id    TEXT
status            BOOLEAN
```

### Tabela: leads_distribuidos
```sql
id               UUID PRIMARY KEY
cliente_id       UUID (FK)
lead_id          TEXT UNIQUE
nome             TEXT
telefone         TEXT
email            TEXT
tipo_financiamento TEXT
valor_parcela    NUMERIC
data_distribuicao TIMESTAMP
```

---

## 🚀 DEPLOY

**Frontend**: Vercel (automático)
**Backend**: Railway (automático)
**Database**: Supabase (na nuvem)

Veja [README_DEPLOY.md](./README_DEPLOY.md) para instruções detalhadas.

---

## 📄 LICENÇA

MIT - Desenvolvido para Zaytan Marketing

---

**Versão**: 1.0.0  
**Status**: ✅ Pronto para Produção  
**Autor**: Vinicius (vinicius.ap202@gmail.com)
