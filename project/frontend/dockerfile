# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


COPY . .

# Expose the development server port
EXPOSE 3000
CMD ["npm", "start"]
