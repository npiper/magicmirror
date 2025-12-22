#!/bin/sh

CNT_PORT="$(cat ${MM_DIR}/config/config.js | sed -rn 's|\s+port:\s+([0-9]+),.*|\1|p' | head -n 1)"
$(echo $CNT_PORT | grep -E '[0-9]{4}' > /dev/null) || CNT_PORT=8080
wget -qO /dev/null http://0.0.0.0:${CNT_PORT}
