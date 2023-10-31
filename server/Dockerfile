FROM node:18-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


# Install Dependencies
COPY ./server/package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

# Exports
EXPOSE 5000

CMD ["npm","start"]