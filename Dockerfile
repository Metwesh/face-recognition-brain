FROM node:18.0.0

WORKDIR /usr/src/face-recognition-api

COPY ./ ./

RUN npm i npm@8.8.0 -g
RUN npm install

CMD ["/bin/bash"]