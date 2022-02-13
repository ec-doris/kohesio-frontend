#Build image
FROM node:16.13.2-alpine As builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-dev

#Final image
FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]