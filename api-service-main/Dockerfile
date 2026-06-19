# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Start the server using the dev build
CMD [ "npm", "run", "start:dev" ]
