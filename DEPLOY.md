# Deploy — Paróquia Santa Teresinha

Guia de publicação para produção:

| Camada | Tecnologia | Provedor sugerido |
|---|---|---|
| Frontend | Angular 18 SPA estático | Vercel ou Netlify |
| Backend | NestJS + Node.js | Railway ou Render |
| Banco | PostgreSQL gerenciado | Supabase, Neon ou Railway PostgreSQL |
| DNS / CDN | — | Cloudflare |

---

## Ordem recomendada de publicação

```
1. Provisionar banco de dados PostgreSQL
2. Deploy do backend  →  configurar env vars  →  migrations aplicadas automaticamente
3. Executar seed do admin (primeira vez)
4. Configurar DNS do backend no Cloudflare
5. Atualizar environment.prod.ts com a URL real da API
6. Build e deploy do frontend
7. Configurar DNS do frontend no Cloudflare
8. Testar fluxo completo (health → login → CRUD)
```

---

## 1. Banco de dados

### Provedores recomendados

| Provedor | Free tier | Link |
|---|---|---|
| Supabase | 500 MB, painel visual | https://supabase.com |
| Neon | 0.5 GB, serverless | https://neon.tech |
| Railway PostgreSQL | integra ao deploy | https://railway.app |

Ao criar o banco anote a `DATABASE_URL`. O formato é:

```
postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
```

---

## 2. Deploy do Backend

### Variáveis de ambiente (configure no painel do provedor)

| Variável | Obrigatória | Valor / Instrução |
|---|---|---|
| `DATABASE_URL` | ✅ | URL PostgreSQL do provedor |
| `JWT_SECRET` | ✅ | Gere abaixo — mínimo 64 bytes hex |
| `NODE_ENV` | ✅ | `production` |
| `FRONTEND_URL` | ✅ | Domínio do frontend, ex: `https://paroquia.com` |
| `JWT_EXPIRES_IN` | — | `7d` (padrão) |
| `PORT` | — | Railway/Render definem automaticamente |
| `THROTTLE_TTL` | — | `60000` (padrão: 100 req/min por IP) |
| `THROTTLE_LIMIT` | — | `100` (padrão) |
| `ADMIN_EMAIL` | 1ª vez | E-mail do administrador inicial |
| `ADMIN_PASSWORD` | 1ª vez | Senha do administrador (mín. 12 caracteres) |
| `ADMIN_NAME` | 1ª vez | Nome exibido no painel (padrão: "Administrador") |

> `ADMIN_*` são usados apenas pelo seed. Após criar o admin, podem ser removidos do ambiente.

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Via Railway

1. Crie um projeto em https://railway.app
2. "New Service" → "GitHub Repo" → selecione o repositório
3. Em "Settings → Source", defina **Root Directory**: `backend`
4. O Railway detecta o `Dockerfile` automaticamente
5. Em "Variables", adicione todas as variáveis obrigatórias acima
6. Clique em "Deploy"

O `CMD` do Dockerfile executa automaticamente na inicialização:
```
npx prisma migrate deploy && node dist/main
```

### Via Render

1. "New Web Service" em https://render.com
2. Conecte ao GitHub, **Root Directory**: `backend`
3. **Runtime**: Docker (detecta o Dockerfile)
4. Configure as variáveis de ambiente
5. Deploy

### Passo a passo manual (VPS ou servidor próprio)

```bash
# 1. Instalar dependências
cd backend
npm ci

# 2. Build (gera Prisma Client + compila NestJS)
npm run build

# 3. Aplicar migrations
npm run db:migrate:prod
# equivale a: npx prisma migrate deploy

# 4. Seed do admin (apenas primeira vez)
npm run db:seed
# equivale a: npx prisma db seed

# 5. Iniciar
npm run start:prod
# equivale a: node dist/main
```

### Verificar que o backend está no ar

```bash
curl https://api.paroquia.com/health
# → { "status": "ok", "timestamp": "..." }
```

### Seed do admin em produção (Railway / Render)

No painel do provedor, abra um terminal/console e execute:

```bash
npx prisma db seed
```

O seed é **idempotente**: ignora se o admin já existir.

---

## 3. Deploy do Frontend

### Passo 1 — configurar a URL da API

Edite `dashboard/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.paroquia.com'  // ← URL real do backend
};
```

Faça commit e push antes de prosseguir.

### Via Vercel (recomendado)

O arquivo `dashboard/vercel.json` já está configurado.

1. Crie um projeto em https://vercel.com
2. "Add New Project" → conecte ao GitHub
3. Configure:
   - **Root Directory**: `dashboard`
   - **Framework Preset**: Angular (ou Other)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/paroquia-santa-teresinha/browser`
4. Deploy

### Via Netlify

O arquivo `dashboard/public/_redirects` já garante o roteamento SPA.

1. "Add new site" → "Import an existing project" em https://netlify.com
2. Conecte ao GitHub com:
   - **Base directory**: `dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/paroquia-santa-teresinha/browser`
3. Deploy

> **Por que `_redirects`?** O Angular usa client-side routing. Sem esse arquivo, acessar `/horarios` diretamente devolve 404. O arquivo instrui o CDN a servir sempre o `index.html` e deixar o Angular resolver a rota.

### Build local para verificar antes de publicar

```bash
cd dashboard

# Edite environment.prod.ts com a URL correta, depois:
npm run build

# Servir localmente para testar
npx serve dist/paroquia-santa-teresinha/browser -p 4200 --single
# Abra http://localhost:4200 e teste todas as páginas
```

---

## 4. Cloudflare

### Registros DNS

Após obter as URLs geradas pelos provedores:

| Registro | Tipo | Nome | Destino |
|---|---|---|---|
| Frontend | CNAME | `@` ou `www` | URL do Vercel/Netlify |
| Backend API | CNAME | `api` | URL do Railway/Render |

- Ative o **proxy Cloudflare** (ícone laranja ☁) em ambos os registros
- Em "SSL/TLS", selecione **Full (strict)**

### Domínios personalizados nos provedores

- **Vercel**: Project Settings → Domains → adicione `paroquia.com`
- **Netlify**: Site Settings → Domain Management → Add custom domain
- **Railway**: Service Settings → Networking → Custom Domain

---

## 5. Variáveis de ambiente — referência completa

### Backend (`.env` ou painel do provedor)

```env
# ── Obrigatórias ────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="<64-bytes-hex-aleatorio>"
NODE_ENV="production"
FRONTEND_URL="https://paroquia.com"

# ── Opcionais (têm padrão) ──────────────────────────────────────────────────
JWT_EXPIRES_IN="7d"
PORT=3000
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# ── Apenas para seed inicial (remova após usar) ─────────────────────────────
ADMIN_EMAIL="padre@paroquia.com"
ADMIN_PASSWORD="SenhaForte@2024"
ADMIN_NAME="Padre Fulano"
```

### Frontend

O frontend não usa variáveis de ambiente em runtime. A URL da API é
definida no momento do build em:

```
dashboard/src/environments/environment.prod.ts
```

Troque o valor de `apiUrl` antes de rodar `npm run build`.

---

## 6. Checklist de publicação

### Banco de dados
- [ ] PostgreSQL provisionado e `DATABASE_URL` anotada

### Backend
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` gerado (64 bytes hex)
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` com o domínio real do frontend
- [ ] Deploy realizado — logs sem erros
- [ ] `GET /health` retorna `{ "status": "ok" }`
- [ ] Seed executado — admin criado
- [ ] `POST /auth/login` funciona com as credenciais do admin

### Frontend
- [ ] `environment.prod.ts` com `apiUrl` correto e commitado
- [ ] Build de produção sem erros (`npm run build`)
- [ ] Deploy realizado
- [ ] Página inicial carrega via HTTPS
- [ ] Navegação funciona (F5 em `/horarios` não retorna 404)
- [ ] Login no painel `/login` funciona
- [ ] CRUD de notícias e avisos funciona

### Cloudflare
- [ ] CNAME do frontend aponta para Vercel/Netlify
- [ ] CNAME do backend aponta para Railway/Render
- [ ] Proxy ativo (ícone laranja) em ambos
- [ ] SSL/TLS: Full (strict)
- [ ] Site acessível via HTTPS no domínio definitivo

---

## 7. Arquivos de deploy criados neste projeto

| Arquivo | Finalidade |
|---|---|
| `backend/Dockerfile` | Build e execução containerizada (Railway, Render, Fly.io) |
| `backend/.dockerignore` | Exclui node_modules e .env da imagem |
| `dashboard/vercel.json` | Configuração de build e SPA routing para Vercel |
| `dashboard/public/_redirects` | SPA routing para Netlify |
| `backend/.env.example` | Template de variáveis de ambiente do backend |
