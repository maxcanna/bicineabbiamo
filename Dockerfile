FROM node:18.19.1-alpine
LABEL org.opencontainers.image.authors="massi@massi.dev"
ADD ./ /var/www/bicineabbiamo/
WORKDIR /var/www/bicineabbiamo
ENV NODE_ENV=production
EXPOSE 3000
RUN npm install -g yarn@1.22.22 --force
RUN yarn
CMD ["node", "index.js"]
