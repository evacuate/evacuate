# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Copy New Relic configuration
COPY newrelic.js ./

# Building the app
RUN yarn build

# Start the app
CMD ["yarn", "start"]
