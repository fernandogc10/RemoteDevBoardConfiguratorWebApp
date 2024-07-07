FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm update

COPY . .

RUN apt-get update && apt-get install -y curl

EXPOSE 8080

CMD sh -c 'node index.js & sleep 20 && curl -X POST http://localhost:8080/users -H "Content-Type: application/json" -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" && wait'
