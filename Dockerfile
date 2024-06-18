# webapp Dockerfile
FROM node:20 AS build
WORKDIR /app

# Copy only the necessary files for Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the webapp source code
COPY . .

# Build the webapp
RUN npm run build

# Final stage/image
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ .

# Remove the default NGINX configuration
# RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration to the default location
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9000
