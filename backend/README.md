# Backend – Paróquia Santa Terezinha

API REST construída com **NestJS + Prisma + PostgreSQL**, responsável por alimentar o portal público e o painel administrativo da Paróquia Santa Terezinha.

---

## Stack

| Tecnologia | Versão |
|-----------|--------|
| Node.js | 20+ |
| NestJS | 11 |
| Prisma | 5 |
| PostgreSQL | 16 |
| Socket.IO | 4 |
| JWT | via @nestjs/jwt |
| Docker | compose v2 |

---

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose

---

## Configuração

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com os valores corretos:

```env
# Banco de dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/paroquia_db"

# JWT — gere com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="sua-chave-gerada-aqui"
JWT_EXPIRES_IN="7d"

# Admin inicial (necessário apenas para o seed)
ADMIN_EMAIL="seu-email@dominio.com"
ADMIN_PASSWORD="SenhaForte!2024"
ADMIN_NAME="Administrador"

# Porta (padrão: 3000)
PORT=3000
```

> **Nunca** use senhas padrão ou `JWT_SECRET` fraco em produção. O servidor **não sobe** se `JWT_SECRET` não estiver definido.

---

## Rodando localmente

### 2. Subir o banco de dados (Docker)

```bash
docker compose up -d
```

Isso sobe um PostgreSQL 16 na porta **5434**.

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar as migrations

```bash
npm run db:migrate
```

### 5. Criar o admin inicial (seed)

Certifique-se de que `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão definidos no `.env`, depois execute:

```bash
npx prisma db seed
```

O seed também cria os dados iniciais de horários de missa, sacramentos e informações.
Após a criação do admin, as variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` podem ser removidas do ambiente de produção.

### 6. Iniciar a API

```bash
npm run start:dev   # desenvolvimento com hot-reload
npm run start:prod  # produção (requer build)
```

API disponível em: `http://localhost:3000`

---

## Documentação interativa (Swagger)

```
http://localhost:3000/api/docs
```

Para testar rotas protegidas:
1. Execute `POST /auth/login` com as credenciais do admin
2. Copie o `access_token` da resposta
3. Clique em **Authorize** (canto superior direito)
4. Cole o token — todas as rotas protegidas serão desbloqueadas

---

## Rotas disponíveis

### Auth
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | Não | Login do administrador |

### News (Notícias)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/news` | Não | Listar notícias publicadas |
| GET | `/news/:id` | Não | Buscar notícia |
| POST | `/news` | **Sim** | Criar notícia |
| PATCH | `/news/:id` | **Sim** | Editar notícia |
| DELETE | `/news/:id` | **Sim** | Excluir notícia |

### Notices (Avisos)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/notices` | Não | Listar avisos ativos |
| GET | `/notices/:id` | Não | Buscar aviso |
| POST | `/notices` | **Sim** | Criar aviso |
| PATCH | `/notices/:id` | **Sim** | Editar aviso |
| DELETE | `/notices/:id` | **Sim** | Excluir aviso |

### Events (Eventos)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/events` | Não | Listar eventos publicados |
| GET | `/events/:id` | Não | Buscar evento |
| POST | `/events` | **Sim** | Criar evento |
| PATCH | `/events/:id` | **Sim** | Editar evento |
| DELETE | `/events/:id` | **Sim** | Excluir evento |

### Mass Schedules (Horários das Missas)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/mass-schedules` | Não | Listar horários |
| POST | `/mass-schedules` | **Sim** | Criar horário |
| PATCH | `/mass-schedules/:id` | **Sim** | Editar horário |
| DELETE | `/mass-schedules/:id` | **Sim** | Excluir horário |

### Sacramentos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/sacramentos` | Não | Listar sacramentos |
| POST | `/sacramentos` | **Sim** | Criar sacramento |
| PATCH | `/sacramentos/:id` | **Sim** | Editar sacramento |
| DELETE | `/sacramentos/:id` | **Sim** | Excluir sacramento |

### Horários Info (Informações Importantes)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/horarios-info` | Não | Listar informações |
| POST | `/horarios-info` | **Sim** | Criar informação |
| PATCH | `/horarios-info/:id` | **Sim** | Editar informação |
| DELETE | `/horarios-info/:id` | **Sim** | Excluir informação |

---

## WebSocket (Tempo Real)

O servidor expõe um gateway Socket.IO para atualizações em tempo real no frontend.

**Eventos emitidos pelo servidor:**

| Evento             | Disparado quando                    |
|--------------------|-------------------------------------|
| `notices:changed`  | Aviso criado, editado ou excluído   |
| `news:changed`     | Notícia criada, editada ou excluída |
| `events:changed`   | Evento criado, editado ou excluído  |

**Conexão (cliente):**
```typescript
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
socket.on('notices:changed', () => { /* recarregar dados */ });
```

---

## Scripts disponíveis

```bash
npm run start:dev    # inicia com hot-reload
npm run start:prod   # inicia em modo produção
npm run build        # compila TypeScript
npm run db:migrate   # roda migrations do Prisma
npm run db:generate  # gera o Prisma Client
npm run db:seed      # seed de dados iniciais e admin
npm run db:studio    # abre o Prisma Studio (GUI do banco)
```

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | **Sim** | URL de conexão PostgreSQL |
| `JWT_SECRET` | **Sim** | Chave secreta JWT (mín. 64 bytes) |
| `JWT_EXPIRES_IN` | Não | Expiração do token (padrão: `7d`) |
| `ADMIN_EMAIL` | Para seed | E-mail do admin inicial |
| `ADMIN_PASSWORD` | Para seed | Senha do admin inicial |
| `ADMIN_NAME` | Não | Nome do admin (padrão: `Administrador`) |
| `PORT` | Não | Porta da API (padrão: `3000`) |

---

## Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma         # modelos do banco de dados
│   ├── seed.ts               # seed de dados iniciais
│   └── migrations/           # histórico de migrations
├── src/
│   ├── app.module.ts         # módulo raiz
│   ├── main.ts               # bootstrap + Swagger + CORS
│   ├── auth/                 # login e JWT
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/                # serviço de usuários
│   ├── news/                 # CRUD de notícias
│   ├── notices/              # CRUD de avisos
│   ├── events/               # CRUD de eventos
│   ├── mass-schedules/       # CRUD de horários de missa
│   ├── sacramentos/          # CRUD de sacramentos
│   ├── horarios-info/        # CRUD de informações importantes
│   ├── realtime/             # WebSocket Gateway (Socket.IO)
│   └── prisma/               # PrismaService global
├── docker-compose.yml        # PostgreSQL local
├── .env.example              # modelo de variáveis de ambiente
└── package.json
```

---

## Testando com Insomnia / Postman

**1. Login:**
```json
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "seu-admin@dominio.com",
  "password": "sua-senha"
}
```

**2. Usar o token nas rotas protegidas:**
```
Authorization: Bearer <access_token>
```

**3. Exemplo — criar notícia em destaque:**
```json
POST http://localhost:3000/news
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Missa Solene de Santa Terezinha",
  "date": "2026-10-01",
  "summary": "Celebração especial da padroeira.",
  "content": "Texto completo da notícia...",
  "category": "paroquia",
  "featured": true
}
```

**4. Exemplo — criar aviso urgente:**
```json
POST http://localhost:3000/notices
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Alteração de horário",
  "date": "2026-10-01",
  "description": "A missa das 07h será às 08h neste domingo.",
  "priority": "urgent",
  "category": "liturgia",
  "featured": true
}
```
