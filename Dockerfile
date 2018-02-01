FROM node:6.1
EXPOSE 9999
RUN mkdir /usr/wwwroot/
WORKDIR /usr/wwwroot/
COPY ./.build /usr/wwwroot/.build
COPY ./*.json /usr/wwwroot/
COPY ./src /usr/wwwroot/src
RUN apt-get update && apt install build-essential -y
RUN npm install --production
CMD node .build/main.js