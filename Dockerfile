FROM node:12.6.0-alpine
ADD . /app
WORKDIR /app
RUN yarn install --prod
CMD ["yarn", "pm2-runtime", "start", "--env", "production", "ecosystem.config.js"]