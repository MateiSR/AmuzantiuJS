FROM node:18-alpine as base
RUN npm install --global npm --silent
WORKDIR /usr/src/app
COPY ./package*.json ./

FROM base as production
ENV NODE_ENV = production
RUN npm install --omit=dev --silent
COPY . .
CMD ["npm", "start"]