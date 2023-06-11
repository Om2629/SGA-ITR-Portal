FROM node:12.18.3-alpine

COPY . /opt/server
RUN cd /opt/server
WORKDIR /opt/server

#RUN npm config set cafile=/opt/server/zscaler-root.cer && \
#    npm config set strict-ssl=false && \
#    npm config set registry=http://registry.npmjs.org/

# RUN mkdir -p /opt/server/attachments/input
# RUN mkdir -p /opt/server/attachments/processing
# RUN mkdir -p /opt/server/attachments/done

RUN apk --no-cache add --virtual native-deps \
  g++ gcc make python && \
  npm install && \
  apk del native-deps

RUN apk update && apk add bash

RUN chmod +x start-server.sh
RUN dos2unix start-server.sh

EXPOSE 1337

CMD ["./start-server.sh"]


