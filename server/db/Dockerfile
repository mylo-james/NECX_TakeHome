FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN apt-get update && apt-get install -y netcat
COPY wait-for-mongo.sh /wait-for-mongo.sh
RUN chmod +x /wait-for-mongo.sh

CMD [ "/wait-for-mongo.sh", "mongo", "node", "seed.mjs" ]