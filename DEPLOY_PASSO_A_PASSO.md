# 🚀 DEPLOY ZAYTAN LEAD MANAGER - PASSO A PASSO VISUAL

## ⚠️ IMPORTANTE: ANTES DE COMEÇAR

Você já tem:
- ✅ Credenciais Supabase
- ✅ Banco de dados criado
- ✅ Código pronto
- ✅ Arquivo .env configurado

**Agora precisa fazer:**
1. Criar 2 contas (Railway + Vercel)
2. Deploy em 3 cliques
3. **Pronto!**

---

## 📋 CHECKLIST DE CREDENCIAIS

```
✅ SUPABASE_URL: https://tknzwtobtlrjgolzyfml.supabase.co
✅ SUPABASE_KEY: eyJhbGc... (salvo em .env)
✅ Node.js 18+: instalado?
✅ Git: instalado?
✅ GitHub: conta criada?
```

Se faltou algo, volta e configura antes de continuar.

---

## 🎯 PASSO 1: PREPARAR REPOSITÓRIO GITHUB

### 1.1 Se ainda não tem repositório no GitHub

```bash
# Entre na pasta do projeto
cd zaytan-leads-app

# Inicialize git (se já não tiver)
git init

# Adicione os arquivos
git add .

# Commit
git commit -m "Initial commit: Zaytan Lead Manager"

# Crie um repositório novo no GitHub:
# https://github.com/new
# Nome: zaytan-leads-app
# Público (para deploy)

# Adicione o remote
git remote add origin https://github.com/SEU_USUARIO/zaytan-leads-app.git

# Envie para GitHub
git branch -M main
git push -u origin main
```

### 1.2 Se já tem repositório

```bash
git add .
git commit -m "Add: Web app with dashboard"
git push
```

---

## 🚢 PASSO 2: DEPLOY BACKEND (Railway) - 5 MINUTOS

### 2.1 Criar Conta Railway

1. Acesse: **https://railway.app**
2. Clique em **"Sign Up with GitHub"**
3. Autorize o GitHub

### 2.2 Criar Novo Projeto

1. No painel Railway, clique em **"+ New Project"**
2. Selecione **"Deploy from GitHub"**
3. Selecione seu repositório: **zaytan-leads-app**

### 2.3 Adicionar Variáveis de Ambiente

1. No painel do projeto, clique em **"Variables"**
2. Adicione estas 3 variáveis:

```
SUPABASE_URL = https://tknzwtobtlrjgolzyfml.supabase.co
SUPABASE_KEY = eyJhbGc... (copie de .env)
NODE_ENV = production
```

### 2.4 Deploy Automático

1. Railway vai detectar `backend/package.json` automaticamente
2. Vai fazer build e deploy
3. Espere 2-3 minutos ⏳

### 2.5 Obter URL do Backend

1. Quando terminar, clique no projeto Railway
2. Vá em **"Settings"**
3. Procure por **"Domains"**
4. Copie a URL (ex: `https://zaytan-backend-xxx.railway.app`)

**GUARDE ESSA URL! Vai usar no frontend.**

---

## 🎨 PASSO 3: DEPLOY FRONTEND (Vercel) - 5 MINUTOS

### 3.1 Criar Conta Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize Vercel

### 3.2 Importar Projeto

1. No dashboard Vercel, clique em **"Import Project"**
2. Clique em **"Import Git Repository"**
3. Cole sua URL do GitHub:
   ```
   https://github.com/SEU_USUARIO/zaytan-leads-app
   ```
4. Clique em **"Import"**

### 3.3 Configurar Deploy

Na tela "Configure Project":

1. **Framework Preset**: Selecione **"Vite"**
2. **Root Directory**: Clique em **"./frontend"**
3. **Build Command**: Mantenha como está

### 3.4 Adicionar Variável de Ambiente

Na seção **"Environment Variables"**:

```
Nome: VITE_API_URL
Valor: https://zaytan-backend-xxx.railway.app
```

(Substitua pela URL do Railway que você copiou)

### 3.5 Deploy!

1. Clique em **"Deploy"**
2. Espere 2-3 minutos ⏳
3. Quando terminar, clique em **"Continue to Dashboard"**

### 3.6 Obter URL do Frontend

Na página do projeto, procure por **"Domains"**. Você vai ver algo como:

```
https://zaytan-leads-xyz.vercel.app
```

---

## ✅ VERIFICAR SE FUNCIONA

### Teste 1: Frontend Carrega

```
Abra: https://zaytan-leads-xyz.vercel.app

Você deve ver:
- Cabeçalho azul "Zaytan Lead Manager"
- Tabs: Dashboard, Clientes, Leads
- Botão "Novo Cliente"
```

Se não carregar, verifique:
- VITE_API_URL está correto?
- Backend está rodando?

### Teste 2: Backend Responde

```bash
curl https://zaytan-backend-xxx.railway.app/health

Resposta esperada:
{"status":"OK","timestamp":"2026-04-15T..."}
```

### Teste 3: Enviar Lead Teste

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

Resposta esperada:
```json
{
  "status": "overflow",
  "message": "Lead enviado para transbordo",
  "lead_id": "TEST_001"
}
```

(Porque não tem cliente ainda - isso é normal!)

---

## 🎯 USAR O DASHBOARD

1. Acesse: **https://zaytan-leads-xyz.vercel.app**
2. Clique em **"Novo Cliente"**
3. Preencha:
   - Nome: `Cliente A`
   - Saldo: `1000.00`
   - Limite: `20`
   - Sheets ID: (deixe em branco por enquanto)
4. Clique em **"Criar Cliente"**

### Agora teste novamente:

```bash
curl -X POST https://zaytan-backend-xxx.railway.app/webhook/leads \
  -H "Content-Type: application/json" \
  -d '{
    "id_lead": "TEST_002",
    "nome": "Maria Silva",
    "telefone": "11987654322",
    "email": "maria@test.com",
    "tipo_financiamento": "Revisional",
    "valor_parcela": 2500.00
  }'
```

Resposta esperada:
```json
{
  "status": "success",
  "message": "Lead distribuído com sucesso",
  "lead_id": "TEST_002",
  "cliente": "Cliente A",
  "saldo_atual": 980.00
}
```

✅ **FUNCIONA!**

No dashboard você vai ver:
- Dashboard: 1 cliente ativo, saldo R$ 980
- Clientes: Cliente A com R$ 980
- Leads: TEST_002 distribuído para Cliente A

---

## 🔗 INTEGRAÇÃO COM META ADS

Quando tiver tudo testado, configure no Meta Ads:

**Webhook URL:**
```
https://zaytan-backend-xxx.railway.app/webhook/leads
```

**Método**: POST
**Content-Type**: application/json

Seus leads vão ser distribuídos automaticamente! 🎉

---

## 🐛 SE ALGO DER ERRO

### Erro: "Cannot find module"
```
No Railway, clique em Logs
Procure por erros de módulo
Redeploye: Settings → Redeploy
```

### Erro: "CORS"
```
Se browser disser "CORS error"
Verifique VITE_API_URL
Deve ter https:// e sem / no final
```

### Erro: "Unauthorized"
```
Supabase key está correta?
Está usando Anon Key, não Service Role?
```

### Leads não aparecem no dashboard
```
Cliente foi criado?
Cliente tem status = true?
Cliente tem saldo >= R$ 20?
```

---

## 📞 VOCÊ AGORA TEM

```
Frontend:  https://zaytan-leads-xyz.vercel.app
Backend:   https://zaytan-backend-xxx.railway.app
Database:  Supabase (tknzwtobtlrjgolzyfml)
```

**Sistema 100% funcional em produção!** 🚀

---

## 🎉 PRÓXIMOS PASSOS

1. ✅ Adicionar mais clientes no dashboard
2. ✅ Configurar Google Sheets (integração)
3. ✅ Conectar Meta Ads webhook
4. ✅ Começar a receber leads!

---

**Tudo pronto! Execute os passos acima e sua app está no ar!** 🚀
