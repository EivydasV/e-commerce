ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}

USER node

WORKDIR /app

COPY --chown=node:node package*.json yarn*.lock ./

RUN yarn install

COPY --chown=node:node . .

USER root


RUN npm i -g @nestjs/cli

USER node

EXPOSE 3000

CMD yarn start:dev