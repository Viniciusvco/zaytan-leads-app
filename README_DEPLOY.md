# 🚀 ZAYTAN LEAD MANAGER - GUIA DE DEPLOY

## 📋 PRÉ-REQUISITOS

- ✅ Conta Supabase criada
- ✅ Banco de dados com tabelas (SQL do projeto anterior)
- ✅ Chaves Supabase (URL + Anon Key)
- ✅ Contas em Vercel (frontend) e Railway (backend)

---

## 🎯 PASSO 1: PREPARAR CREDENCIAIS SUPABASE

### Obter Chaves do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **Anon Public Key**: `ey...` (chave longa)

---

## 🎯 PASSO 2: DEPLOY DO BACKEND (Railway)

### A. Criar Conta Railway

1. Acesse: https://railway.app
2. Clique em **Sign Up with GitHub**
3. Autentique com sua conta GitHub

### B. Deploy Backend

1. No Railway, clique em **+ New Project**
2. Selecione **Deploy from GitHub**
3. Selecione o repositório: `zaytan-leads-app`
4. Railway vai detectar automaticamente o backend

### C. Configurar Variáveis de Ambiente

1. No painel Railway, vá em **Variables**
2. Adicione:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon-do-supabase
   NODE_ENV=production
   PORT=3001
   ```

### D. Obter URL do Backend

Após deploy bem-sucedido:
- Railway vai gerar uma URL: `https://zaytan-backend-xxx.railway.app`
- **Copie essa URL!** Vai usar no frontend

---

## 🎯 PASSO 3: DEPLOY DO FRONTEND (Vercel)

### A. Criar Conta Vercel

1. Acesse: https://vercel.com
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub**

### B. Importar Projeto

1. Clique em **Import Project**
2. Cole a URL do repositório GitHub:
   ```
   https://github.com/seu-usuario/zaytan-leads-app
```

3. Selecione a pasta: `./frontend`

### C. Configurar Variáveis

Na tela de configuração, adicione:
```
VITE_API_URL=https://zaytan-backend-xxx.railway.app
```

(Substitua pela URL do Railway obtida no Passo 2)

### D. Deploy

1. Clique em **Deploy**
2. Aguarde 2-3 minutos
3. Vercel vai gerar uma URL: `https://zaytan-leads.vercel.app`

---

## ✅ VERIFICAR SE FUNCIONA

### Teste 1: Frontend Carrega
```
Abra: https://zaytan-leads.vercel.app
Você deve ver o dashboard
```

### Teste 2: Backend Responde
```
curl https://zaytan-backend-xxx.railway.app/health

Esperado:
{"status":"OK","timestamp":"2026-04-15T..."}
```

### Teste 3: Conectou Supabase
```
Abra: https://zaytan-leads.vercel.app
Vá em "Clientes"
Deve estar vazio (ou com dados do Supabase)
```

---

## 🔧 ENVIAR UM LEAD TESTE

### Webhook para Testar

```bash
curl -X POST https://zaytan-backend-xxx.railway.app/webhook/leads \
  -H "Content-Type: application/json" \
  -d '{
    "id_lead": "TEST_001",
    "nome": "João Silva",
    "telefone": "11987654321",
    "email": "joao@test.com",
    "tipo_financiamento": "Revisional",
    "valor_parcela": 2500.00
  }'
```

**Resposta esperada:**
```json
{
  "status": "overflow",
  "message": "Lead enviado para transbordo",
  "lead_id": "TEST_001"
}
```

(Porque não tem cliente cadastrado ainda)

---

## 🔗 CONECTAR META ADS

Quando tiver tudo pronto, configure no Meta Ads:

**Webhook URL:**
```
https://zaytan-backend-xxx.railway.app/webhook/leads
```

**Método**: POST
**Content-Type**: application/json

---

## 📊 USAR O DASHBOARD

1. Acesse: https://zaytan-leads.vercel.app
2. Vá em **"Novo Cliente"**
3. Preencha:
   - Nome: Cliente A
   - Saldo: 1000.00
   - Limite: 20
   - Sheets ID: (opcional)
4. Clique em **"Criar Cliente"**

Agora:
- ✅ Pode enviar leads
- ✅ Leads vão ser distribuídos automaticamente
- ✅ Dashboard mostra tudo em tempo real

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module"
```bash
# No Railway, rode:
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Unauthorized - Missing credentials"
- Verifique SUPABASE_URL e SUPABASE_KEY
- Certifique-se de usar **Anon Key**, não **Service Role Key**

### Frontend não conecta com Backend
- Verifique VITE_API_URL
- Deve ser a URL do Railway (com https://)
- Sem barra no final

### Leads não aparecem
- Verifique se tem cliente cadastrado
- Verifique se cliente tem status=true
- Verifique se cliente tem saldo >= R$ 20

---

## 📱 INTEGRAÇÃO CONTÍNUA

Toda vez que fizer push no GitHub:

1. **Frontend** → Deploy automático na Vercel
2. **Backend** → Deploy automático no Railway

Nada de manual!

---

## 🎉 PRONTO!

Sua app está rodando em produção!

```
Frontend: https://zaytan-leads.vercel.app
Backend:  https://zaytan-backend-xxx.railway.app
Database: Supabase (seu-projeto.supabase.co)
```

**Próximas ações:**
1. Compartilhar link com seu time
2. Configurar webhook do Meta Ads
3. Adicionar clientes no dashboard
4. Começar a receber leads!

---

**Dúvidas?** Consulte a documentação no projeto raiz.
