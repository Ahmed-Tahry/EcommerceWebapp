# Use an official Node.js runtime as a parent image (Builder Stage)
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app/invoice_service

# Copy package.json and package-lock.json (if available)
# Copy only package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
# Using --omit=dev for a smaller production build if devDependencies aren't needed for runtime
# However, for build step, devDependencies (like typescript, ts-node) are needed.
# So, install all first, then prune if necessary, or use multi-stage build correctly.
# Install Puppeteer dependencies for Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    udev \
    xvfb

# It's often recommended to use a specific Puppeteer cache directory
ENV XDG_CONFIG_HOME=/tmp/.config \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm install

# Copy the rest of the application code into the builder stage
COPY . .

# Build TypeScript code
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app/invoice_service

# Copy built artifacts from builder stage
# Only copy necessary files for production
COPY --from=builder /usr/src/app/invoice_service/dist ./dist
COPY --from=builder /usr/src/app/invoice_service/node_modules ./node_modules
COPY --from=builder /usr/src/app/invoice_service/package*.json ./

# Expose the port the app runs on (as defined in config or .env)
# The default in config.ts is 3002 for INVOICE_SERVICE_PORT
EXPOSE 3002

# Command to run the application
# This should run the compiled JavaScript code.
# Assumes "start": "node dist/server.js" in package.json's scripts.
CMD ["npm", "start"]
