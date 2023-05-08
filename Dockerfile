FROM node:20-bullseye-slim as root
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM root AS builder

WORKDIR /src/
COPY package*.json *.lock tsconfig.json ./
RUN yarn
COPY . .
RUN yarn build

FROM root
WORKDIR /dist/
COPY --from=builder /src /dist/
RUN yarn --prod
EXPOSE 3030
ENTRYPOINT ["node", "./build/index.js"]