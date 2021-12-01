#Build image
FROM node:12.16.1-alpine As builder
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python2 && \
    npm install --quiet node-gyp -g
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run ng -- build --configuration=dev --outputHashing=all --no-progress

#Final image
FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]