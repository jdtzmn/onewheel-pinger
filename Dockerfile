FROM node:12.6.0-alpine

USER 1000

ENV PM2_HOME=/home/node/.pm2

RUN \
  yarn global add pm2 && \
  adduser node root

COPY . /home/node/app
WORKDIR /home/node/app

RUN \
  yarn install --production && \
  pm2 install typescript && \
  chmod -R 755 /home/node/.pm2 && \
  chown -R node:node /home/node/.pm2

CMD ["pm2-runtime", "start", "--env", "production", "ecosystem.config.js"]