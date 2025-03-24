FROM node:22.13.1-alpine3.20 AS dev
WORKDIR /app
COPY package.json package.json
RUN yarn install 
CMD [ "yarn", "start:dev" ]