# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app
ENV PATH="./node_modules/.bin:$PATH"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Expose a port for development (usually React apps run on port 3000)
EXPOSE 3008

# Start the development server (you can customize the start command as needed)
CMD ["npm" , "run" , "dev"]
