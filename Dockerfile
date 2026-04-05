# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install dependencies using npm ci for a clean, deterministic install
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
