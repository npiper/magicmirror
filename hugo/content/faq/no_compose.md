---
title: How to start MagicMirror² without using `compose.yaml` files?
breadcrumbs: false
---

If you don't want to use `compose.yaml` files you can start and stop your container with `docker run` commands. For starting the container you have to translate the `compose.yaml` file into a `docker run ...` command. As the `compose.yaml` contains includes you can show the expanded content by running `docker compose config`.

Here an example, `compose.yaml`:

```yaml
include:
  - includes/${MM_MMPM}.yaml
  - includes/${MM_LABWC}.yaml
  - includes/${MM_WATCHTOWER}.yaml

services:
  magicmirror:
    container_name: mm
    restart: always
    extends:
      file: includes/base.yaml
      service: ${MM_SCENARIO}
```

Expanded `compose.yaml`, output of `docker compose config`:

```yaml
name: run
services:
  magicmirror:
    container_name: mm
    image: karsten13/magicmirror:latest
    networks:
      default: null
    ports:
      - mode: ingress
        target: 8080
        published: "8080"
        protocol: tcp
    restart: always
    volumes:
      - type: bind
        source: /mnt/z/k13/magicmirror/mounts/config
        target: /opt/magic_mirror/config
        bind:
          create_host_path: true
      - type: bind
        source: /mnt/z/k13/magicmirror/mounts/modules
        target: /opt/magic_mirror/modules
        bind:
          create_host_path: true
networks:
  default:
    name: run_default
```

Corresponding `docker run` command:

```bash
docker run  -d \
    --publish 8080:8080 \
    --restart unless-stopped \
    --volume ~/magicmirror/mounts/config:/opt/magic_mirror/config \
    --volume ~/magicmirror/mounts/modules:/opt/magic_mirror/modules \
    --name mm \
    karsten13/magicmirror:latest
```

You can stop and remove the container with `docker rm -f mm`.

> [!TIP]
> You can look for online tools where you can paste the content of your expanded `compose.yaml` which gives you the corresponding `docker run ...` commands, for example [decomposerize](https://www.decomposerize.com/).
