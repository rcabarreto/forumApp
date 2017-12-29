FROM node:6.11.1

RUN apt-get update && apt-get -y install netcat && apt-get clean

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json .

RUN npm install

COPY . .

RUN chmod +x ./wait.sh

EXPOSE 3000

CMD [ "./wait.sh", "&&", "npm", "start" ]
