# Dockerfile for React client

# Build react client
FROM node:18-alpine3.17

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN npm install --silent

# copy local files to app folder
COPY . .

### Build App
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]