FROM node:13.13.0-alpine

WORKDIR /opt

COPY service.js .
COPY package.json .

RUN npm install

EXPOSE 8000

CMD ["node", "service.js"]
