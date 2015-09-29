FROM node:latest
MAINTAINER team@breizhcamp

RUN npm install -g brunch bower
WORKDIR /opt
RUN git clone https://github.com/BreizhJUG/breizhcamp.git
WORKDIR /opt/breizhcamp
RUN npm install
RUN bower --allow-root --config.interactive=false install

EXPOSE 3333

CMD brunch w
