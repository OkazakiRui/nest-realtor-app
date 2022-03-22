FROM node:16.10.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

EXPOSE 3000

ENTRYPOINT [ "yarn", "start:dev" ]