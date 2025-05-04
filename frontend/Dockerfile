# Build stage
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies in build stage
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run build command to create the production-ready build
RUN npm run build

# Production stage
FROM node:20 as production

# Set working directory for the production image
WORKDIR /app

# Install 'serve' globally to serve the production build
RUN npm install -g serve

# Copy the build output from the build stage
COPY --from=build /app/build ./build

# Expose the port for the app
EXPOSE 3000

# Start the app using 'serve' to serve the build
CMD ["serve", "-s", "build", "-l", "3000"]
