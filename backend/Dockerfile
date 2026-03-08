FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Expose API port
EXPOSE 5000

# Start command
CMD ["node", "src/server.js"]
