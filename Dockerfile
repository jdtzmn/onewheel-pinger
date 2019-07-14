FROM node:12.6.0-alpine
ADD . /code
WORKDIR /code
RUN npm install -s --only=production
RUN npm run postinstall
CMD ["npm", "start"]