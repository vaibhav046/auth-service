FROM node:10.13.0-alpine

#Create Workdir 
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package.json
COPY .env .env
COPY . .

# Bundle app source
RUN npm install

EXPOSE 80:5001
CMD [ "npm", "start" ]