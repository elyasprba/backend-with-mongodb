FROM node:lts

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g typescript

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:build"]