# Backend – Paróquia Santa Teresinha

API REST construída com **NestJS + Prisma + PostgreSQL**, responsável por alimentar o portal público e o painel administrativo da Paróquia Santa Teresinha.

---

## Stack

| Tecnologia | Versão |
|-----------|--------|
| Node.js | 20+ |
| NestJS | 10 |
| Prisma | 5 |
| PostgreSQL | 16 |
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

O `.env` já vem configurado para o Docker local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/paroquia_db"
JWT_SECRET="troque-por-uma-chave-secreta-forte"
JWT_EXPIRES_IN="7d"
PORT=3000
```

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

### 4. Rodar a migration

```bash
npm run db:migrate
```

> Quando pedir um nome para a migration, digite: `init`

### 5. Criar o admin inicial (seed)

```bash
npm run db:seed
```

Credenciais criadas:

| Campo | Valor |
|-------|-------|
| Email | `admin@paroquia.com` |
| Senha | `admin123` |

### 6. Iniciar a API

```bash
npm run start:dev   # desenvolvimento com hot-reload
npm run start       # produção
```

API disponível em: `http://localhost:3000`

---

## Documentação interativa (Swagger)

Acesse no navegador após iniciar a API:

```
http://localhost:3000/api/docs
```

Para testar rotas protegidas:
1. Execute `POST /auth/login` com as credenciais do admin
2. Copie o `access_token` da resposta
3. Clique em **Authorize** (canto superior direito do Swagger)
4. Cole o token e confirme — todas as rotas protegidas serão desbloqueadas

---

## Rotas disponíveis

### Auth
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | Não | Login do administrador |

### News (Notícias)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/news` | Não | Listar notícias |
| GET | `/news/:id` | Não | Buscar notícia |
| POST | `/news` | **Sim** | Criar notícia |
| PATCH | `/news/:id` | **Sim** | Editar notícia |
| DELETE | `/news/:id` | **Sim** | Excluir notícia |

### Notices (Avisos)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/notices` | Não | Listar avisos |
| GET | `/notices/:id` | Não | Buscar aviso |
| POST | `/notices` | **Sim** | Criar aviso |
| PATCH | `/notices/:id` | **Sim** | Editar aviso |
| DELETE | `/notices/:id` | **Sim** | Excluir aviso |

### Events (Eventos)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/events` | Não | Listar eventos |
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

---

## Scripts disponíveis

```bash
npm run start:dev    # inicia com hot-reload
npm run start        # inicia em produção
npm run build        # compila TypeScript
npm run db:migrate   # roda migrations do Prisma
npm run db:seed      # cria o admin inicial
npm run db:studio    # abre o Prisma Studio (GUI do banco)
```

---

## Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma       # modelos do banco de dados
│   └── seed.ts             # seed do admin inicial
├── src/
│   ├── app.module.ts       # módulo raiz
│   ├── main.ts             # bootstrap + Swagger + CORS
│   ├── auth/               # login e JWT
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/              # serviço de usuários
│   ├── news/               # CRUD de notícias
│   ├── notices/            # CRUD de avisos
│   ├── events/             # CRUD de eventos
│   ├── mass-schedules/     # CRUD de horários de missa
│   └── prisma/             # PrismaService global
├── docker-compose.yml      # PostgreSQL local
├── .env.example
└── package.json
```

---

## Testando com Insomnia / Postman

**1. Login:**
```json
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@paroquia.com",
  "password": "admin123"
}
```

**2. Usar o token nas rotas protegidas:**
```
Authorization: Bearer <access_token>
```

**3. Exemplo — criar notícia:**
```json
POST http://localhost:3000/news
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Missa Solene de Santa Teresinha",
  "date": "2026-10-01",
  "summary": "Celebração especial da padroeira.",
  "content": "Texto completo da notícia...",
  "featured": true
}
```

**4. Exemplo — criar horário de missa:**
```json
POST http://localhost:3000/mass-schedules
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "day": "Domingo",
  "time": "09h00",
  "observation": "Missa com grupo de jovens"
}
```
