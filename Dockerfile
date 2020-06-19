FROM node:12-alpine
WORKDIR ./
COPY ./package*.json ./
COPY . .
RUN npm install
EXPOSE 3000
CMD ["nodemon", "index.js"]