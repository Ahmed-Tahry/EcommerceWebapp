# frontend/remos-react/Dockerfile

# Stage 1: Build
# Use a specific Node.js version consistent with development if possible
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json (or yarn.lock if used)
COPY package*.json ./
# If using yarn:
# COPY yarn.lock ./
# RUN yarn install --frozen-lockfile
RUN npm ci # Use npm ci for cleaner installs based on package-lock.json

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# The standalone output will be in .next/standalone
RUN npm run build

# Stage 2: Production
# Use a minimal base image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production
# Set HOST to 0.0.0.0 to ensure it's accessible from outside the container by its IP address
ENV HOST 0.0.0.0
# Next.js default port is 3000. Can be overridden by PORT env var.
# ENV PORT 3000

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy the .next/static directory which is required by the standalone output
# It's usually inside .next/standalone/app/.next/static but referencing from build output path is safer.
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Expose the port the app runs on (default 3000 for Next.js)
EXPOSE 3000

# Command to run the application
# The server.js file is created by the standalone output mode
CMD ["node", "server.js"]
