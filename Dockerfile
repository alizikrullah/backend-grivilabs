# Versi dikunci. `node:22-alpine` itu label bergerak — tiap build bisa dapat npm
# versi berbeda, dan perilaku npm bisa berubah tanpa satu baris pun di repo ini
# diubah. Naikkan versinya secara sadar saat mau, bukan kena kejutan saat deploy.
FROM node:22.23.1-alpine

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

# Sabuk pengaman. `prisma generate` sebenarnya sudah jalan lewat postinstall saat
# `npm ci`, tapi rantai itu bisa putus tanpa suara — misalnya kalau ada paket lain
# yang gagal dipasang sebelum giliran postinstall tiba. Menjalankannya sekali lagi
# di sini murah dan memastikan Prisma Client benar-benar ada di image final.
RUN npx prisma generate

# JANGAN tambahkan `npm prune --production` di sini.
#
# `npm ci` di atas menjalankan postinstall `prisma generate`, yang menaruh hasil
# cetakannya di node_modules/.prisma. Folder itu bukan paket npm, jadi prune
# menganggapnya sampah dan ikut menghapusnya.
#
# Gejalanya menipu: aplikasi tetap menyala dan endpoint `/` menjawab normal,
# tapi SEMUA query ke database gagal dengan "Database error" — karena Prisma
# Client-nya sudah tidak ada. Ini yang terjadi pada deploy df6eb73.
#
# Kalau nanti ukuran image perlu ditekan, pakai multi-stage build dan salin
# node_modules/.prisma ke stage terakhir — bukan prune.

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]