ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-bullseye-slim

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -q -y procps

USER node

WORKDIR /usr/src/app

USER root

RUN npm i -g @nestjs/cli

USER node

COPY --chown=node:node package*.json yarn*.lock ./

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn", "start:debug"]

