# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 5000

# Run server.js when the container launches
CMD ["node", "src/server.js"]
