# set the base image to create the image for react app
ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}

USER node

WORKDIR /app

COPY package*.json yarn*.lock ./

# install dependencies
RUN yarn install

# copy the rest of the files to the working directory
COPY . .

USER root

RUN chown -R node:node /app

USER node

# expose port 3000 to tell Docker that the container listens on the specified network ports at runtime
EXPOSE 3000

# command to run the app
CMD yarn start:dev