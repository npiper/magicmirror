---
title: How to install OS dependencies needed by a module?
breadcrumbs: false
---

You have 3 choices:

### Build your own image

This is the preferred solution if you need a lot of dependencies and start time of MagicMirror² matters. Here an example Dockerfile for [MMM-GoogleCast](https://github.com/ferferga/MMM-GoogleCast):

```bash
FROM karsten13/magicmirror:latest

USER root

RUN set -e; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get -qy --allow-unauthenticated install python3 python3-pip; \
    pip3 install pychromecast --break-system-packages; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*; \
    python3 --version;

USER node
```

### Use a start script

This is the preferred solution if you need only a few dependencies and start time of MagicMirror² doesn't matter. For this you have to write a `start_script.sh` file which can be used inside the container.

Here an example for the content of `start_script.sh`. If you want to use e.g. [MMM-ServerStatus](https://github.com/XBCreepinJesus/MMM-ServerStatus) you need to install the missing `ping` command. This is done by this `start_script.sh`:

```bash
#!/bin/sh
apt-get update
apt-get install -y iputils-ping
```

#### Option1: Config directory

You can add the `start_script.sh` beside the `config.js` on the host (in `~/magicmirror/mounts/config`). Because the `apt-get` command require root access you must add

```yaml
    user: root
```

to your `compose.yaml`.

#### Option2: Additional volume mount

Put the `start_script.sh` file beside your `compose.yaml` file. Additionally the `start_script.sh` file must be mapped into the container so you need to add a `volumes` section to your `compose.yaml` file (and add the root user to be able to install packages):

```yaml
    user: root
    volumes:
      - ./start_script.sh:/opt/magic_mirror/start_script.sh
```

### Use the `fat` image

Since release `v2.17.1` a new image `karsten13/magicmirror:fat` is provided. This image is based on `debian:latest` (not on `debian:slim` as the other images) and contains already many dependencies, e.g. python. You can try this image if you need packages missing in the normal images. Be aware that this image is really `fat` so pulling this image takes longer, especially on a raspberry pi.
