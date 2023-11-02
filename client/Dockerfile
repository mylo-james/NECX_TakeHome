# Dockerfile for Next.js client

# Build Next.js client
FROM node:18-alpine3.17 as build

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies
RUN npm install

# copy local files to app folder
COPY . .

### Build App
RUN npm run build

# Stage 2 - the production environment
FROM node:18-alpine3.17
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]