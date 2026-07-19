FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Install semua deps termasuk devDeps untuk build
# NODE_ENV sengaja tidak di-set di sini supaya @types/* ikut terinstall
RUN npm ci

COPY src/ ./src/

RUN npm run build

# Hapus devDeps setelah build, biar image lebih kecil
RUN npm prune --production

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]