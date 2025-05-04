# Build stage
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Production stage
FROM node:18 as production

# Set working directory for the production image
WORKDIR /app

# Copy only the necessary files from the build stage (node_modules and app code)
COPY --from=build /app ./

# Expose the port for the backend app
EXPOSE 3020

# Run the application
CMD ["node", "app.js"]
