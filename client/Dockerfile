FROM node:16-alpine

WORKDIR /usr/src/app
ENV PATH="./node_modules/.bin:$PATH"

COPY package*.json .

COPY . .

EXPOSE 3008

CMD ["npm" , "run" , "dev"]
