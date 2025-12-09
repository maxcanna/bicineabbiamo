FROM node:22-alpine
LABEL org.opencontainers.image.authors="massi@massi.dev"
ADD ./ /var/www/bicineabbiamo/
WORKDIR /var/www/bicineabbiamo
ENV NODE_ENV=production
HEALTHCHECK CMD wget -q -O /dev/stdout localhost:3000/api?onlyFirstResult=true | grep bikescount
EXPOSE 3000
RUN npm install -g yarn@1.22.22 --force
RUN yarn
CMD ["node", "index.js"]
