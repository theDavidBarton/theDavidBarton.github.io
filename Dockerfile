# Dockerize local snapshot
FROM node:16

WORKDIR /usr/src/github

COPY package.json ./
COPY . .

EXPOSE 3000
CMD ["npx", "serve"]