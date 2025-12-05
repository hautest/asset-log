FROM node:24-alpine as builder

WORKDIR /app

# import dependencies
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

# copy assets
COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]