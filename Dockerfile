#Build image
FROM node:16.13.2-alpine As builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-dev:ssr
COPY proxy-server.js /usr/src/app/dist/kohesio-frontend/server/proxy-server.js

#Nginx with node server
FROM node:18.13.0-alpine AS ssr-server
COPY --from=builder /usr/src/app/dist/ /app/dist/
COPY --from=builder /usr/src/app/node_modules/ /app/node_modules/
COPY ./package.json /app/package.json
WORKDIR /app
EXPOSE 80
CMD npm run serve:ssr
