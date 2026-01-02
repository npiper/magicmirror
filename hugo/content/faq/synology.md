---
title: Starting on Synology NAS errors when mounting volumes
breadcrumbs: false
---

Running `docker compose up -d` fails with

```bash
Container mm Starting 1.3s
Error response from daemon: Bind mount failed: '/var/services/homes/xy/magicmirror/mounts/config' does not exist
```

This happens if the mount directories misses on the host. If you clone this project using the defaults or the install script, this will create the mount directories. But if you use a custom setup you have to create these directories on your own.

This seems a limitation of Synology because the docker daemon lacks permission to create the folders under your home directory.
