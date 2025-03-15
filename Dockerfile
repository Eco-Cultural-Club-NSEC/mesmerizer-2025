FROM node:latest

WORKDIR /usr/src/app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "npm", "run", "dev:docker" ]