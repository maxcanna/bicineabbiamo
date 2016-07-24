#!/bin/bash
set -e

node_modules/.bin/jshint $(find . ! -path '*node_modules*' -name '*.js')

node_modules/.bin/dredd
