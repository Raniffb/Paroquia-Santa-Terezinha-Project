# Dashboard – Paróquia Santa Terezinha

Frontend Angular 18 que serve tanto o **site público** quanto o **painel administrativo** da Paróquia Santa Terezinha de Manaus/AM.

> Este projeto consome a API em `backend/`. Certifique-se de que o backend está rodando antes de iniciar.

---

## Stack

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| Angular | 18 | Framework principal |
| TypeScript | 5.5 | Linguagem |
| Angular Animations | 18 | Carrossel com slide direcional |
| Socket.IO Client | 4 | Atualizações em tempo real |
| PrimeIcons | 7 | Ícones |
| PrimeFlex | 4 | Utilitários CSS |
| RxJS | 7.8 | Gerenciamento de fluxos |

---

## Páginas e Rotas

### Site Público

| Rota | Descrição |
| --- | --- |
| `/` | Home — carrossel de destaques, avisos recentes, eventos e sacramentos |
| `/noticias` | Listagem de notícias com filtro por categoria |
| `/noticias/:id` | Detalhe de uma notícia |
| `/avisos` | Listagem de avisos com filtro por categoria |
| `/avisos/:id` | Detalhe de um aviso |
| `/eventos` | Listagem de eventos com filtro |
| `/horarios` | Horários das missas e confissões |
| `/contato` | Informações de contato |

### Painel Administrativo

| Rota | Descrição |
| --- | --- |
| `/admin/login` | Login com JWT |
| `/admin` | Dashboard com resumo |
| `/admin/noticias` | Gerenciar notícias |
| `/admin/noticias/nova` | Criar notícia |
| `/admin/noticias/:id/editar` | Editar notícia |
| `/admin/avisos` | Gerenciar avisos |
| `/admin/avisos/novo` | Criar aviso |
| `/admin/avisos/:id/editar` | Editar aviso |
| `/admin/eventos` | Gerenciar eventos |
| `/admin/eventos/novo` | Criar evento |
| `/admin/eventos/:id/editar` | Editar evento |
| `/admin/horarios` | Gerenciar horários, sacramentos e informações |

---

## Pré-requisitos

- Node.js 20+
- Angular CLI 18: `npm install -g @angular/cli`
- Backend rodando em `http://localhost:3000`

---

## Instalação

```bash
cd dashboard
npm install
```

---

## Variáveis de Ambiente

O arquivo de configuração fica em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

Para produção, edite `src/environments/environment.prod.ts` com a URL real da API.

---

## Rodando em Desenvolvimento

```bash
npm start
```

Acesse em: `http://localhost:4200`

### Acesso pela rede local (celular/tablet)

```bash
npm run start:lan   # escuta em 0.0.0.0
```

> Antes, atualize `apiUrl` em `environment.ts` com o IP da máquina (ex: `http://192.168.1.10:3000`).

---

## Build para Produção

```bash
npm run build
```

Arquivos gerados em `dist/paroquia-santa-teresinha/`. Sirva com qualquer servidor HTTP estático (nginx, Apache, etc.).

---

## Scripts Disponíveis

```bash
npm start              # servidor de desenvolvimento (localhost)
npm run start:lan      # servidor de desenvolvimento (rede local)
npm run build          # build de produção
npm run watch          # build incremental (desenvolvimento)
npm test               # testes unitários (Karma + Jasmine)
```

---

## Funcionalidades Principais

### Carrossel de Destaques (Home)

- Exibe avisos, notícias e eventos com a flag `featured: true`
- Animação de slide direcional (Angular Animations — `:increment`/`:decrement`)
- Auto-rotação a cada 5 segundos
- Clique manual nas setas ou dots reseta o timer
- Navegação para página de detalhe via "Ver detalhes"

### Atualizações em Tempo Real (WebSocket)

- Conexão automática com o backend via Socket.IO
- Quando o admin cria, edita ou exclui conteúdo, o site atualiza sem recarregar
- Eventos escutados: `notices:changed`, `news:changed`, `events:changed`

### Painel Admin

- CRUD completo de Notícias, Avisos e Eventos
- Marcação de destaque para exibição no carrossel
- Seletor visual de ícones para Sacramentos (29 ícones em 4 categorias)
- Gerenciamento de horários de missa, confissões e informações importantes
- Autenticação JWT com persistência no localStorage

---

## Estrutura do Projeto

```text
dashboard/src/
├── app/
│   ├── app.config.ts            # providers globais (HTTP, Router, Animations)
│   ├── app.routes.ts            # rotas lazy-loaded
│   │
│   ├── core/
│   │   ├── models/
│   │   │   └── parish.models.ts # interfaces: Aviso, Noticia, Evento, ItemDestaque…
│   │   └── services/
│   │       ├── parish.service.ts    # chamadas à API pública
│   │       └── realtime.service.ts  # WebSocket (Socket.IO)
│   │
│   ├── features/                # páginas do site público
│   │   ├── home/
│   │   │   └── components/
│   │   │       ├── destaque/    # carrossel de destaques
│   │   │       ├── avisos/      # seção de avisos/notícias recentes
│   │   │       ├── eventos/     # próximos eventos
│   │   │       ├── horarios/    # horários resumidos
│   │   │       ├── header/
│   │   │       └── footer/
│   │   ├── noticias/            # listagem + noticias-detalhe
│   │   ├── avisos/              # listagem + avisos-detalhe
│   │   ├── eventos/
│   │   ├── horarios/
│   │   └── contato/
│   │
│   ├── admin/                   # painel administrativo
│   │   ├── core/
│   │   │   ├── guards/          # AuthGuard JWT
│   │   │   ├── models/          # AdminAviso, AdminNoticia…
│   │   │   └── services/        # serviços de CRUD admin
│   │   └── features/
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── noticias/        # list + form
│   │       ├── avisos/          # list + form
│   │       ├── eventos/         # list + form
│   │       └── horarios/        # horários + sacramentos + informações
│   │
│   └── shared/
│       └── components/
│           └── page-hero/       # cabeçalho de página reutilizável
│
├── environments/
│   ├── environment.ts           # dev — aponta para localhost:3000
│   └── environment.prod.ts      # produção — aponta para API real
└── styles.scss                  # estilos globais + classes .adm-* do admin
```

---

## Arquitetura

- **Standalone Components** — sem NgModules, todos os componentes são independentes
- **Lazy Loading** — cada rota carrega seu componente sob demanda
- **Signals** — estado reativo no admin com `signal()` e `computed()`
- **takeUntilDestroyed** — limpeza automática de subscriptions
- **forkJoin** — requisições paralelas (ex: avisos + notícias combinados)
