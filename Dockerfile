# Stage 1: Base image for common setup
FROM node:20 AS BASE

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the Prisma schema
COPY prisma ./prisma

# Install dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Stage 2: Development environment
FROM BASE AS development

# Set DATABASE_URL as a build argument
ARG DATABASE_URL

# Set DATABASE_URL as an environment variable
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Start the app in development mode
CMD ["npm", "run", "dev"]

# Stage 3: Production environment
FROM BASE AS production

# Set DATABASE_URL as a build argument
ARG DATABASE_URL

# Set DATABASE_URL as an environment variable
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Run Prisma migrations
RUN npx prisma migrate deploy

# Build the Next.js app
RUN npm run build

# Start the app in production mode
CMD ["npm", "run", "start"]
