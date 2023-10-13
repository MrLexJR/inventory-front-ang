# Node version
FROM node:20 as build

# Create folder
RUN mkdir -p /app

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app
RUN npm install

# Copy app 
COPY . /app
RUN npm run build

# Segunda etapa
FROM nginx:latest 
COPY --from=build /app/dist/front-inventory /usr/share/nginx/html



