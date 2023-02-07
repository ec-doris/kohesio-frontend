#Build image
FROM node:16.13.2-alpine As builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prerender:dev
COPY proxy-server.js /usr/src/app/dist/kohesio-frontend/server/proxy-server.js

#Nginx with nginx client
FROM nginx:1.15.8-alpine AS client-browser
COPY --from=builder /usr/src/app/dist/kohesio-frontend/browser/ /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx/default.ssr.conf /etc/nginx/conf.d/default.conf

#Nginx with node server
FROM node:18.13.0-alpine AS ssr-server
RUN npm install -g pm2@latest
COPY --from=builder /usr/src/app/dist/ /app/dist/
COPY --from=builder /usr/src/app/node_modules/ /app/node_modules/
COPY ./package.json /app/package.json
WORKDIR /app
EXPOSE 4000
CMD npm run serve:ssr
