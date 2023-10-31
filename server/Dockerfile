FROM node:18-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


# Install Dependencies
COPY ./server/package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

# Install netcat
RUN apk update && apk add netcat-openbsd

# Make the wait-for-mongo.sh script executable
COPY ./server/db/wait-for-mongo.sh /wait-for-mongo.sh
RUN chmod +x /wait-for-mongo.sh

# Exports
EXPOSE 5000

CMD [ "/bin/sh", "-c", "/wait-for-mongo.sh mongo && node dist/index.js && node dist/seed.js" ]