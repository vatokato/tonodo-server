FROM node:12-alpine
WORKDIR ./
RUN npm install
COPY ./package*.json ./
COPY . .
EXPOSE 3000
CMD ["nodemon", "index.js"]