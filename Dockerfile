FROM node:16

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD [ "npm", "run", "start" ]