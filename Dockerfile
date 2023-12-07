FROM node:latest as node
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/fmonitoreo-aulas /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
