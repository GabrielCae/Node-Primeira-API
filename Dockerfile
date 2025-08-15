FROM node:22-alpine

WORKDIR /app

COPY . ./

RUN npm ci --only=production

EXPOSE 3333

CMD ["node", "src/server.ts"]