FROM node:latest
MAINTAINER team@breizhcamp

RUN npm install -g brunch bower
ADD . /opt/breizhcamp
WORKDIR /opt/breizhcamp
RUN npm install
RUN bower --allow-root --config.interactive=false install

EXPOSE 3333
EXPOSE 9485

CMD brunch w
