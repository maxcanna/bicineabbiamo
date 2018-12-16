FROM node:alpine as builder
RUN apk update
RUN apk add git python make g++
ADD ./ /var/www/bicineabbiamo/
WORKDIR /var/www/bicineabbiamo
RUN yarn --production --ignore-engines

FROM node:alpine
LABEL maintainer Massimiliano Cannarozzo <maxcanna@gmail.com>
WORKDIR /var/www/bicineabbiamo
COPY --from=builder /var/www/bicineabbiamo .
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
CMD ["yarn", "start"]
