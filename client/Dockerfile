# Build stage
FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM node:16
WORKDIR /app
# Copy the build artifacts from the previous stage
COPY --from=build /app/build ./build
# Install serve
RUN npm install -g serve
# Expose the port serve will run on
EXPOSE 3000
# Command to serve the app
CMD ["serve", "-s", "build", "-l", "3000"]