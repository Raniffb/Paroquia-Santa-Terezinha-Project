# Paróquia Santa Terezinha — Portal Web

Portal oficial da Paróquia Santa Terezinha de Manaus/AM. Projeto full-stack composto por uma API REST (backend) e dois frontends Angular: o site público e o painel administrativo.

---

## Visão Geral

```
Paroquia-Santa-Terezinha-Project/
├── backend/       # API REST — NestJS + Prisma + PostgreSQL
└── dashboard/     # Site público + Admin — Angular 18
```

| Camada | Tecnologia | Porta padrão |
|--------|-----------|-------------|
| API | NestJS 11 + Prisma 5 | `3000` |
| Site público | Angular 18 | `4200` |
| Painel admin | Angular 18 (rota `/admin`) | `4200` |
| Banco de dados | PostgreSQL 16 (Docker) | `5434` |
| WebSocket | Socket.IO 4 | `3000` |

---

## Funcionalidades

### Site Público
- **Início**: carrossel de destaques (avisos, notícias e eventos marcados como destaque), lista de avisos/notícias recentes, horários de missa, próximos eventos e sacramentos
- **Notícias**: listagem com filtro por categoria, página de detalhe individual
- **Avisos**: listagem com filtro por categoria, página de detalhe individual
- **Eventos**: listagem com filtro por categoria e mês
- **Horários**: horários das missas por dia da semana e confissões
- **Contato**: informações e formulário de contato
- **Atualizações em tempo real** via WebSocket — o site atualiza automaticamente quando o admin publica conteúdo

### Painel Administrativo (`/admin`)
- Gerenciamento completo de Notícias, Avisos e Eventos (CRUD)
- Campo "Destaque" — itens marcados aparecem no carrossel da home
- Gerenciamento de Horários de Missa, Sacramentos, Informações e Confissões
- Seletor visual de ícones para Sacramentos
- Autenticação JWT

---

## Pré-requisitos

- **Node.js** 20+
- **Docker** + Docker Compose (para o banco de dados)
- **Angular CLI** 18: `npm install -g @angular/cli`

---

## Instalação e Setup Completo

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Paroquia-Santa-Terezinha-Project
```

### 2. Configure o backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/paroquia_db"

# Gere com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="sua-chave-gerada-aqui"
JWT_EXPIRES_IN="7d"

ADMIN_EMAIL="seu-email@dominio.com"
ADMIN_PASSWORD="SenhaForte!2024"
ADMIN_NAME="Administrador"

PORT=3000
```

```bash
npm install
docker compose up -d        # sobe o PostgreSQL
npm run db:migrate          # cria as tabelas
npx prisma db seed          # popula dados iniciais e cria o admin
```

### 3. Configure o frontend

```bash
cd ../dashboard
npm install
```

> O frontend já aponta para `http://localhost:3000` por padrão (`src/environments/environment.ts`).

---

## Rodando em Desenvolvimento

Abra **dois terminais**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd dashboard
npm start
```

| Serviço | URL |
|---------|-----|
| Site público | http://localhost:4200 |
| Painel admin | http://localhost:4200/admin |
| API REST | http://localhost:3000 |
| Swagger (docs) | http://localhost:3000/api/docs |

---

## Rodando na Rede Local (celular/tablet)

Para testar em dispositivos na mesma rede Wi-Fi:

**1.** Descubra o IP da máquina:
```bash
# Windows
ipconfig

# Linux/macOS
ifconfig | grep "inet "
```

**2.** Atualize `dashboard/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://SEU_IP:3000'   // ex: http://192.168.1.10:3000
};
```

**3.** Inicie o frontend com acesso à rede:
```bash
cd dashboard
npm run start:lan   # ng serve --host 0.0.0.0
```

**4.** Acesse no dispositivo: `http://SEU_IP:4200`

> Lembre de reverter `environment.ts` para `localhost` após os testes.

---

## Build para Produção

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd dashboard
npm run build
# arquivos gerados em: dashboard/dist/
```

---

## Variáveis de Ambiente (Backend)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | **Sim** | URL de conexão PostgreSQL |
| `JWT_SECRET` | **Sim** | Mín. 64 bytes aleatórios — servidor não sobe sem ela |
| `JWT_EXPIRES_IN` | Não | Expiração do token (padrão: `7d`) |
| `ADMIN_EMAIL` | Para seed | E-mail do admin inicial |
| `ADMIN_PASSWORD` | Para seed | Senha do admin inicial |
| `ADMIN_NAME` | Não | Nome do admin (padrão: `Administrador`) |
| `PORT` | Não | Porta da API (padrão: `3000`) |

---

## Estrutura Detalhada

```
Paroquia-Santa-Terezinha-Project/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # modelos: User, News, Notice, Event,
│   │   ├── seed.ts                  #   MassSchedule, Sacramento, HorariosInfo
│   │   └── migrations/
│   ├── src/
│   │   ├── main.ts                  # bootstrap + Swagger + CORS
│   │   ├── app.module.ts
│   │   ├── auth/                    # JWT login
│   │   ├── users/
│   │   ├── news/                    # Notícias
│   │   ├── notices/                 # Avisos
│   │   ├── events/                  # Eventos
│   │   ├── mass-schedules/          # Horários de missa
│   │   ├── sacramentos/
│   │   ├── horarios-info/           # Informações importantes
│   │   ├── realtime/                # WebSocket Gateway (Socket.IO)
│   │   └── prisma/                  # PrismaService
│   ├── docker-compose.yml
│   ├── .env.example
│   └── package.json
│
└── dashboard/
    └── src/
        ├── app/
        │   ├── core/
        │   │   ├── models/          # interfaces TypeScript
        │   │   └── services/        # ParishService, RealtimeService
        │   ├── features/            # páginas do site público
        │   │   ├── home/            # carrossel + seções
        │   │   ├── noticias/        # listagem + detalhe
        │   │   ├── avisos/          # listagem + detalhe
        │   │   ├── eventos/
        │   │   ├── horarios/
        │   │   └── contato/
        │   ├── admin/               # painel administrativo
        │   │   ├── features/        # noticias, avisos, eventos, horários
        │   │   └── core/            # guards, services, models
        │   └── shared/              # componentes reutilizáveis
        └── environments/
            ├── environment.ts       # dev
            └── environment.prod.ts  # produção
```

---

## Scripts Rápidos

```bash
# Backend
npm run start:dev      # dev com hot-reload
npm run db:migrate     # rodar migrations
npx prisma db seed     # seed de dados e admin
npm run db:studio      # GUI do banco (Prisma Studio)

# Frontend
npm start              # dev (localhost)
npm run start:lan      # dev (rede local, --host 0.0.0.0)
npm run build          # build produção
```

---

## Segurança

- Senhas armazenadas com **bcrypt** (12 rounds)
- Autenticação via **JWT** com expiração configurável
- `JWT_SECRET` obrigatório — servidor recusa subir sem ele
- Credenciais do admin **nunca hardcoded** — lidas exclusivamente de variáveis de ambiente
- `.env` no `.gitignore` — nunca versionado

---

## Contribuição

1. Crie uma branch: `git checkout -b feat/nome-da-feature`
2. Commit suas mudanças: `git commit -m "feat: descrição"`
3. Abra um Pull Request

---

## Licença

Projeto privado — Paróquia Santa Terezinha, Manaus/AM.
