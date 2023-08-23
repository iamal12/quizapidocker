# Use an official Node.js runtime as the parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json /app/

# Install dependencies in the container
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Specify the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
