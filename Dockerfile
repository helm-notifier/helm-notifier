FROM openfaas/of-watchdog:0.7.2 as watchdog

FROM node:12.13.0-slim as ship

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN apt-get install ca-certificates

WORKDIR /root/

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /home/app

# Wrapper/boot-strapper
WORKDIR /home/app
COPY . /home/app/

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i --production --quiet

# chmod for tmp is for a buildkit issue (@alexellis)
RUN chown node:node -R /home/app \
    && chmod 777 /tmp

USER node

ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV HTTP_PORT="3000"
ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]

