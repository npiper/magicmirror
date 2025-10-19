---
title: Starting on synology nas errors when mounting volumes
breadcrumbs: false
---

Running `docker compose up -d` fails with

```bash
Container mm Starting 1.3s
Error response from daemon: Bind mount failed: '/var/services/homes/xy/magicmirror/mounts/config' does not exist
```

This happens if the mount directories on the host are not present. If you use the defaults or the install script the mount directories are created when cloning this repository, but if you use a custom setup you have to creates these directories on your own.

This seems to be a limitation of synology because the docker daemon does not have permission to create the folders under your home directory.
