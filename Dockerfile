FROM node:4.2
MAINTAINER team@breizhcamp

RUN npm install -g brunch@1.8.5
ADD . /opt/breizhcamp
WORKDIR /opt/breizhcamp
RUN npm install
#RUN bower --allow-root --config.interactive=false install

EXPOSE 3333
EXPOSE 9485

CMD brunch w
