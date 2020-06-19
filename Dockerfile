FROM node:12-alpine
WORKDIR /
COPY ./package*.json ./
COPY . .
EXPOSE 3000
CMD ["nodemon", "index.js"]