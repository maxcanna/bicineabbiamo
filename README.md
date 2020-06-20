# bicineabbiamo
[![CI Status](https://github.com/maxcanna/bicineabbiamo/workflows/CI/badge.svg)](https://github.com/maxcanna/bicineabbiamo/actions) [![Docker Status](https://github.com/maxcanna/bicineabbiamo/workflows/Deploy/badge.svg)](https://github.com/maxcanna/bicineabbiamo/actions) [![Docker Pulls](https://img.shields.io/docker/pulls/maxcanna/bicineabbiamo.svg)](https://hub.docker.com/r/maxcanna/bicineabbiamo/) [![](https://img.shields.io/github/license/maxcanna/bicineabbiamo.svg?maxAge=2592000)](https://github.com/maxcanna/bicineabbiamo/blob/master/LICENSE)

Simple API to get BikeMi station informations. [Demo](https://bicineabbiamo.massi.dev).

## How do I get set up?

You've several way to get bicineabbiamo running:

* You can easily create an Heroku application:

  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

* You can use `docker`:

  `docker run -d -p 80:3000 maxcanna/bicineabbiamo:latest`.

* Or manually:

  * `npm i --production`

  * `npm start`

  bicineabbiamo will be available on port `3000`.

## Documentation

Available on [Apiary](http://docs.bicineabbiamo.apiary.io/)
