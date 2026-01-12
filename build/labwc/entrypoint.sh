#!/bin/bash

sudo chown -R pi:pi "$XDG_RUNTIME_DIR"
sudo seatd -u pi -g pi &

[[ -z $RANDR_POLL ]] && RANDR_POLL="1m"
startfile="/tmp/started.txt"

if [[ "$LAB_WC_HIDE_CURSOR" == "true" ]]; then
  sudo cp /usr/share/icons/Adwaita/cursors/transparent /usr/share/icons/Adwaita/cursors/left_ptr
fi

if [[ "$RANDR_PARAMS" != "" ]]; then
  # remove quotes:
  RANDR_PARAMS="${RANDR_PARAMS%\"}"
  RANDR_PARAMS="${RANDR_PARAMS#\"}"
fi

randr_params() {
  if [[ -n "$RANDR_PARAMS" && "$(wlr-randr --json | gojq -r '.[].enabled' | head -n 1)" == "true" ]]; then
    echo "executing: wlr-randr $RANDR_PARAMS"
    wlr-randr $RANDR_PARAMS
  fi
}

startup() {
  # wait until labwc is running
  while ! wlr-randr; do
    sleep 1s
  done

  randr_params

  echo "true" > $startfile
}

startup &

while true; do
  sleep "$RANDR_POLL"
  if [[ -f $startfile ]]; then
    if [[ $(wlr-randr 2>&1 | grep "failed to connect to display") ]]; then
      date
      echo "wlr-randr errors \"failed to connect to display\" so killing container."
      pkill labwc
    else
      randr_params
    fi
  fi
done &

exec labwc
