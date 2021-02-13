# Dockerize local snapshot
FROM node:12

WORKDIR /usr/src/github

COPY package.json ./
COPY . .

EXPOSE 5000
CMD ["npx", "serve"]