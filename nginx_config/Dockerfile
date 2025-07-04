FROM openresty/openresty:alpine-fat

# Install dependencies
RUN apk add --no-cache curl \
    && luarocks install lua-resty-openidc

# Copy NGINX configuration
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Expose port
EXPOSE 80

# Start NGINX
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]