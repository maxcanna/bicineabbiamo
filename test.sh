#!/bin/bash
set -e

export NEW_RELIC_NO_CONFIG_FILE=true
export NEW_RELIC_ENABLED=false
export NEW_RELIC_LOG=/dev/null
if [ -z "$ROLLBAR_KEY" ]; then
    export ROLLBAR_KEY=''
fi

dredd
