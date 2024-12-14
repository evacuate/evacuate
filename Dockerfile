# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Set newrelic environment variables
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED=true

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies and clean cache
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy the rest of the application code to the container
COPY . .

# Building the app
RUN yarn build

# Start the app based on the value of PRODUCTION_LOGGING
CMD ["node", "scripts/run.mjs"]
