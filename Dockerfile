FROM node:12

WORKDIR /app

COPY package*.json ./

COPY truffle-config.js ./

COPY .secret ./

COPY .gas-price-testnet.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]