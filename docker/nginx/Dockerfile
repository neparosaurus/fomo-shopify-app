# Use the official Nginx image as a base
FROM nginx:latest

# Create the log directory and set permissions
RUN mkdir -p /app/var/log && chmod -R 755 /app/var/log

# Copy custom configuration file from the context
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80