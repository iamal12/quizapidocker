# Use an official Node.js runtime as the parent image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /usr/src/app
ENV PATH="./node_modules/.bin:$PATH"

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Copy the rest of the application to the container
COPY . .

# Specify the port the app runs on

EXPOSE 3002

CMD [ "npm" , "run" , "start:dev" ]
