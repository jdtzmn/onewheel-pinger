FROM node:12.6.0-alpine

ENV PM2_HOME=/home/node/app/.pm2

RUN \
  mkdir -p /home/node/app && \
  chown -R node:node /home/node/app && \
  yarn global add pm2

COPY --chown=node:node . /home/node/app
WORKDIR /home/node/app

RUN \
  chmod -R 755 /home/node/app && \
  yarn install --production && \
  pm2 install typescript && \
  chmod -R 755 /home/node/.pm2 && \
  chown -R node:node /home/node/.pm2

USER node

CMD ["pm2-runtime", "start", "--env", "production", "ecosystem.config.js"]