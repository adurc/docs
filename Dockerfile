FROM node:14 as builder

WORKDIR /usr/src/adurc-website

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine as prod

WORKDIR /usr/share/nginx/html

COPY nginx/adurc.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/adurc-website/build/ .

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]