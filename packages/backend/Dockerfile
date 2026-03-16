FROM node:20.19.0

WORKDIR /backend

COPY package*.json ./
RUN yarn install --ignore-engines
COPY . .


CMD yarn prisma generate  && npx prisma migrate deploy && yarn run start:dev
#CMD ["yarn", "start"]