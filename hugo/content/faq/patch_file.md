---
title: How to patch a file of MagicMirror?
breadcrumbs: false
---

You may want to test something or fix a bug in MagicMirror² and you need to edit a file of the MagicMirror² installation.
This works without any problems with a conventional installation, just edit the file, save it and restart MagicMirror.

In a container setup you can login into the container with `docker exec -it mm bash` and edit the file there.
This solution works as long as you restart MagicMirror². With a restart you lose all your changes …

How to handle this?

The short story: Copy the file from inside the container to a directory on the host. Add a volume mount to the `compose.yaml` which mounts the local file back into the container. Now you can edit the file on the host and see the changes inside the container. No problem if you need to restart the container.

The long story with example: MagicMirror² v2.11.0 had a bug which stops MMM-Remote-Control to work ([see](https://github.com/Jopyth/MMM-Remote-Control/issues/185#issuecomment-608600298)). To solve this problem the file `js/socketclient.js` needs some changes.

To get the file from the container to the host (the container must running) go to `~/magicmirror/run` and execute `docker cp mm:/opt/magic_mirror/js/socketclient.js .`

Now you find the file `socketclient.js` in `~/magicmirror/run`, you can do a `ls -la` to verify this.

You can now edit this file and do your changes.

For getting the changes back into the container you have to edit the `compose.yaml` and insert a new volume mount under `volumes:`:

```yaml
    volumes:
      - ./socketclient.js:/opt/magic_mirror/js/socketclient.js
```

If you need to restart the MagicMirror² container just execute `docker compose up -d`.
