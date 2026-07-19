FROM node:22-alpine

WORKDIR /app

# Copy dependency files + prisma schema dulu
COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Install deps (otomatis trigger postinstall -> prisma generate)
RUN npm ci

# Copy source baru compile
COPY src/ ./src/

RUN npm run build

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]