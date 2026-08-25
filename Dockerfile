# syntax=docker/dockerfile:1
# Dev-образ: API на :8080. Mongo піднімає Compose. Не для продакшену.

ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Без .git husky install падає. Не оновлюйте npm@latest — він не сумісний з Node 18.
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
