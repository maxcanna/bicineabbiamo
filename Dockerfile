FROM node:alpine as builder
RUN apk update
RUN apk add git
ADD ./ /var/www/bicineabbiamo/
WORKDIR /var/www/bicineabbiamo
RUN yarn --production --ignore-engines

FROM node:alpine
LABEL mantainer Massimiliano Cannarozzo <maxcanna@gmail.com>
WORKDIR /var/www/bicineabbiamo
COPY --from=builder /var/www/bicineabbiamo .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start"]
