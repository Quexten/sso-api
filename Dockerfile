FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./

COPY . .
EXPOSE 80
CMD [ "npm", "start" ]
