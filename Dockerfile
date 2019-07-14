FROM node:12.6.0-alpine

COPY . /app
WORKDIR /app

ENV PM2_HOME=/home/node/.pm2

RUN \
  yarn global add pm2 && \
  adduser node root && \
  yarn install --production && \
  pm2 install typescript && \
  chmod -R 755 /home/node && \
  chown -R node:node /home/node

USER 1000

CMD ["pm2-runtime", "start", "--env", "production", "ecosystem.config.js"]