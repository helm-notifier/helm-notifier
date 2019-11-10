FROM node:12-slim

ENV SOURCES /app
RUN apt-get -y update && apt-get -y install git && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/man/?? /usr/share/man/??_*

COPY . ${SOURCES}
WORKDIR ${SOURCES}
RUN chown -R node:node ${SOURCES} \
    && chmod 777 /tmp
USER node
RUN npm install --production --quiet

EXPOSE 8080

CMD ["npm", "start"]
