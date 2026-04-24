#!/bin/sh
# Substitute ECS-injected secrets into config.js.template → config.js
# Called automatically by the karsten13 entrypoint if this file exists at
# /opt/magic_mirror/config/start_script.sh
# Uses sed instead of envsubst (not installed in the karsten13 image).
if [ -f /opt/magic_mirror/config/config.js.template ]; then
    sed \
        -e "s|\${GCAL_SECRET_URL}|${GCAL_SECRET_URL}|g" \
        -e "s|\${GCAL_NP_SECRET_URL}|${GCAL_NP_SECRET_URL}|g" \
        -e "s|\${OPENWEATHER_API_KEY}|${OPENWEATHER_API_KEY}|g" \
        /opt/magic_mirror/config/config.js.template > /opt/magic_mirror/config/config.js
fi
