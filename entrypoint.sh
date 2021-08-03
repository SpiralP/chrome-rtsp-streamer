#!/usr/bin/env sh

set -e
set -x

# add virtual audio devices
pulseaudio -D --exit-idle-time=-1
pacmd load-module module-virtual-sink sink_name=virtual-sink
pacmd load-module module-virtual-source source_name=virtual-source
pacmd set-default-sink virtual-sink
pacmd set-default-source virtual-source

yarn start "$@"
