FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn
COPY . .

EXPOSE 3030
#CMD yarn prisma generate  && npx prisma migrate deploy && yarn run start:dev
CMD ["yarn", "start"]