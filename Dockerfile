FROM node:12-alpine

ENV SOURCES /app

COPY . ${SOURCES}
WORKDIR ${SOURCES}
RUN chown -R node:node ${SOURCES}
USER node
RUN npm install --production --quiet

EXPOSE 8080

CMD ["npm", "start"]