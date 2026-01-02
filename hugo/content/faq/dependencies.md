---
title: How to install OS dependencies needed by a module?
breadcrumbs: false
---

You have 3 choices:

### Build your own image

Preferred solution if you need a lot of dependencies and start time of MagicMirror² matters. Here an example Dockerfile for [MMM-GoogleCast](https://github.com/ferferga/MMM-GoogleCast):

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

Preferred solution if you need only a few dependencies and start time of MagicMirror² doesn't matter. For this you have to write a `start_script.sh` file. The container executes this script on start.

Here an example for the content of `start_script.sh`. If you want to use for example [MMM-ServerStatus](https://github.com/XBCreepinJesus/MMM-ServerStatus) you need to install the missing `ping` command. The following `start_script.sh` implements this:

```bash
#!/bin/sh
apt-get update
apt-get install -y iputils-ping
```

#### Option1: Configuration directory

You can add the `start_script.sh` beside the `config.js` on the host (in `~/magicmirror/mounts/config`). Because the `apt-get` command require root access you must add

```yaml
    user: root
```

to your `compose.yaml`.

#### Option2: Extra volume mount

Put the `start_script.sh` file beside your `compose.yaml` file. Additionally you need to add a `volumes` section in your `compose.yaml` file which maps the `start_script.sh` file into the container (and the root user for installing packages):

```yaml
    user: root
    volumes:
      - ./start_script.sh:/opt/magic_mirror/start_script.sh
```

### Use the `fat` image

Since release `v2.17.1` exists a new image `karsten13/magicmirror:fat`. This image contains already many dependencies, for example python. You can try this image if you need packages missing in the normal images. Notice the **fat** size of this image so pulling takes longer, especially on a raspberry pi.
