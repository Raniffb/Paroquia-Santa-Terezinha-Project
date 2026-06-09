FROM node:20-alpine
WORKDIR /app

# Copia manifests primeiro para aproveitar cache de camadas do Docker
COPY package*.json ./
RUN npm ci

# Copia todo o código (inclui prisma/ com schema e migrations)
COPY . .

# Build: gera Prisma Client + compila NestJS para dist/
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Aplica migrations pendentes e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
