FROM node:18.13.0

WORKDIR /usr/src/app

COPY src /usr/src/app/src
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
