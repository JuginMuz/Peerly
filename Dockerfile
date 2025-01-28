FROM node:18

# Install build tools (Python, make, g++) so npm can compile native modules if needed
RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /src
COPY package*.json /src/

# Install dependencies
RUN npm install -g supervisor \
    && npm install \
    && npm install supervisor

COPY . /src

EXPOSE 3000
CMD ["npm", "start"]
