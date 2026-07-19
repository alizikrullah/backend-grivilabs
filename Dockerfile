FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Paksa development supaya devDependencies ikut terinstall
# Coolify inject NODE_ENV=production sebagai build arg, ini override-nya
RUN NODE_ENV=development npm ci

COPY src/ ./src/

RUN npm run build

# Hapus devDeps setelah build
RUN npm prune --production

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]