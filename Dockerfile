# Use Node 20 Alpine for better-sqlite3 compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Build server
RUN cd server && npm run build

# Copy client build to server public directory
RUN mkdir -p server/public && cp -r client/dist/* server/public/

# Expose port
EXPOSE 4000

# Set working directory to server
WORKDIR /app/server

# Run seed and start server
CMD ["sh", "-c", "npm run seed && node dist/index.js"]