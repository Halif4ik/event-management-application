FROM node:20.19.0

WORKDIR /app

COPY package*.json ./
RUN yarn install --ignore-engines
COPY . .

CMD ["yarn", "start"]
