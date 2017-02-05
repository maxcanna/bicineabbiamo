# bicineabbiamo
[![](https://www.versioneye.com/user/projects/5795b57a9cf8860054c8b8b3/badge.svg)](https://www.versioneye.com/user/projects/5795b57a9cf8860054c8b8b3) ![](https://img.shields.io/codeship/f813aa40-54f9-0134-69ea-4e423e130982/master.svg?maxAge=2592000) [![](https://img.shields.io/codeclimate/github/maxcanna/bicineabbiamo.svg?maxAge=2592000)](https://codeclimate.com/github/maxcanna/bicineabbiamo) [![Docker Pulls](https://img.shields.io/docker/pulls/maxcanna/bicineabbiamo.svg)](https://hub.docker.com/r/maxcanna/bicineabbiamo/) [![](https://img.shields.io/github/license/maxcanna/bicineabbiamo.svg?maxAge=2592000)](https://github.com/maxcanna/bicineabbiamo/blob/master/LICENSE)

Simple API to get BikeMi station informations. [Demo](https://bicineabbiamo.massi.ws).

## How do I get set up?

You've several way to get bicineabbiamo running:

* You can easily create an Heroku application:

  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

* You can use `docker`:

  * Using Docker Cloud:

  [![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/)

  * Locally: `docker run -d -p 80:3000 maxcanna/bicineabbiamo:latest`.

* Or manually:

  `npm i --production`

  `npm start`

  bicineabbiamo will be available on port `3000`.

## Documentation

Available on [Apiary](http://docs.bicineabbiamo.apiary.io/)
