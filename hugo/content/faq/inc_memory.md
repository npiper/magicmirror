---
title: Running on a raspberry pi ends with a white or black screen after a while
breadcrumbs: false
---

Found this behavior running the module `MMM-RAIN-MAP` which fetches a greater amount of images for the map. If you run modules which needs a greater amount of shared memory, you have to increase `shm_size` in the `compose.yaml`. The default uses `shm_size: "256mb"` so if you need a higher value add a new line

```yaml
services:
  magicmirror:
    shm_size: "512mb"
```

in `compose.yaml` and restart the container with `docker compose up -d`.
