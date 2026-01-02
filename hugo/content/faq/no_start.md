---
title: My container doesn't start
breadcrumbs: false
---

If an error occurs which force MagicMirror² to quit then this will restart the container again and again. You can try to catch the logs with `docker logs mm`.

As better approach for debugging you can add a `command` section in your `compose.yaml`:

```yaml
    command: 
      - sleep
      - infinity
```

and restart the container with `docker compose up -d`. Then you can login into the container with `docker exec -it mm bash`. By default your shell opens in the MagicMirror² directory (`/opt/magic_mirror`). From here you can start the mirror with `node --run server` in server-only mode or with `node --run start` on your raspberry pi. Now you can examine the logs to catch the errors.
