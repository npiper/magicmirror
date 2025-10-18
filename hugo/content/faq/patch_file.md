---
title: How to patch a file of MagicMirror?
breadcrumbs: false
---

You may want to test something or fix a bug in MagicMirror² and therefore you want to edit a file of the MagicMirror² installation.
With a classic install this is no problem, just edit the file, save it and restart MagicMirror.

In a container setup this is not so simple. You can login into the container with `docker exec -it mm bash` and edit the file there.
This solution works as long as no restart of MagicMirror² is required. After a restart your changes are gone ...

So how to handle this?

The short story: Copy the file from inside the container to a directory on the host. Add a volume mount to the `compose.yaml` which mounts the local file back into the container. Now you can edit the file on the host and the changes are provided to the container. No problem if you need to restart the container.

The long story with example: In MagicMirror² v2.11.0 was a bug which stops the MMM-Remote-Control to work ([see](https://github.com/Jopyth/MMM-Remote-Control/issues/185#issuecomment-608600298)). So to solve this problem we patched the file `js/socketclient.js`.

To get the file from the container to the host (the container must be running) goto `~/magicmirror/run` and execute `docker cp mm:/opt/magic_mirror/js/socketclient.js .`

Now the file `socketclient.js` is located under `~/magicmirror/run`, you can do a `ls -la` to control this.

You can now edit this file and do your changes.

For getting the changes back into the container you have to edit the `compose.yaml` and insert a new volume mount under `volumes:`:

```yaml
    volumes:
      - ./socketclient.js:/opt/magic_mirror/js/socketclient.js
```

Thats it. If you need to restart the MagicMirror2 container just execute `docker compose up -d`.
