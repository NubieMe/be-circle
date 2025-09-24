# Stage 1: build (compile TypeScript)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source & build
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine

WORKDIR /app

# Copy only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

CMD ["npm", "start"]
