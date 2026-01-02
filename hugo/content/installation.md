---
title: Installation
weight: 1
breadcrumbs: false
---

## Installation prerequisites

{{% steps %}}

### Docker

See [Installation Instructions](https://docs.docker.com/engine/installation/)

### Docker post install

To run `docker` commands without needing `sudo` please refer to the [Linux post install documentation](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

### Docker compose

If not already installed you find [here](https://docs.docker.com/compose/install/linux/) instructions how to install it.

> [!IMPORTANT]
> This setup needs `docker compose` version `2.20.3` or greater, you can check the version with `docker compose version`. If you don't want to use compose, see [this section in the FAQ](/faq/no_compose/)

{{% /steps %}}


## Prerequisites for running on a raspberry pi with Scenario **electron** ✌️ or **client** 👌

{{% steps %}}

### Disable screensaver

Disable the screensaver (depends on the underlying OS), otherwise MagicMirror² will disappear after a while.

### Wait for network at boot

Enable "Wait for Network at Boot" (with `sudo raspi-config`, navigate to "3 boot options" and choose "B2 Wait for Network at Boot"). If not set, some modules will remaining in "loading…" state because MagicMirror² starts to early.

### Disable WLAN power save

When using WLAN you should disable "Power Save" (depends on the underlying OS, for example `sudo iw wlan0 set power_save off`), otherwise MagicMirror² can not update the displayed data without working internet connection.

{{% /steps %}}

## Installation of this repository

Open a shell in your home directory and run
```bash
git clone https://gitlab.com/khassel/magicmirror.git
```

### Use install script

`cd` into the new directory `magicmirror/install` and  execute `bash install.sh <scenario>` where you have to replace `<scenario>` with `electron` or `server` or `client`.

### Manual Install

`cd` into the new directory `magicmirror/run` and copy 2 files:

```bash
cd ./magicmirror/run
cp original.env .env
cp original.compose.yaml compose.yaml
```

Depending on the scenario you have to edit the `.env` file:

For scenario **server** ☝️:
```bash
MM_SCENARIO="server"
```
> [!IMPORTANT]
> You have to edit the value `MM_SERVER_PORTS` in the `.env` file if you run scenario **server** and want to use another port.

That matches the default.

For scenario **electron** ✌️:
```bash
MM_SCENARIO="electron"
```

For scenario **client** 👌:
```bash
MM_SCENARIO="client"
MM_INIT="no_init"
```

> [!IMPORTANT]
> You have to edit the values `MM_CLIENT_PORT` and `MM_CLIENT_ADDRESS` in the `.env` file if you run scenario **client**.

### Using own compose file

If you have an own compose file where you want to add this setup you can use the install script or manual install and then run `docker compose config` in the `magicmirror/run` folder. You can copy/paste the output in your existing compose file. You find more information in the [FAQ](/faq/no_compose/).

Here a minimal compose file for scenario **server** ☝️:

```yaml
services:
  magicmirror:
    container_name: mm
    image: karsten13/magicmirror:latest
    restart: always
    volumes:
      - ../mounts/config:/opt/magic_mirror/config
      - ../mounts/modules:/opt/magic_mirror/modules
      - ../mounts/css/custom.css:/opt/magic_mirror/css/custom.css
    ports:
      - 8080:8080
```

## Start MagicMirror²

Navigate to `~/magicmirror/run` and execute

```bash
docker compose up -d
```

The container will start and with scenario **electron** ✌️ or **client** 👌 the MagicMirror² should appear on the screen of your pi. In server only mode opening a browser at `http://localhost:8080` should show the MagicMirror² (scenario **server** ☝️).

> The default configuration restarts containers automatically so after executing `docker compose up -d` it will also restart after a reboot of your pi.


You can see the logs with

```bash
docker logs mm
```

Executing
```bash
docker ps -a
```
will show all containers and 

```bash
docker compose down
```

will stop and remove the MagicMirror² container.

You can restart the container with one command `docker compose up -d --force-recreate`, for example necessary after configuration changes.

## Updating the image

The MagicMirror²-Project has quarterly releases so they release a new version every 1st of Jan/Apr/Jul/Oct.

This project creates new container images weekly every Sunday to get (security) updates of the operating system.

To get the newest image you have to update this locally. Navigate to `~/magicmirror/run` and execute

```bash
docker compose pull
```

After the new pull completed you have to restart the container with

```bash
docker compose up -d
```

> With every new image the old image remains on your hard disc and occupies disk space. To get rid of all old images you can execute `docker image prune -f`.

## Volume permissions

The container runs with UserId=1000, which normally matches the UserId of the pi user.

At first start the docker daemon creates the volumes on the host (~/magicmirror/mounts/*) with userid=0 (root). With these permissions the container can't access the volumes. To correct this the mm container executes a `post_start` command with every start.

If you don't want or need this behavior you can remove it by setting `MM_INIT="no_init"` in the `.env` file.

## Running as root

The container has no root permissions and no `sudo` installed, so if you need such permissions you have to add `user: root` to the `compose.yaml` file.

## Running on Raspberry Pi OS Lite (or on another operating system without desktop)

You can use Raspberry Pi OS Lite as operating system which has no graphical desktop. You have to setup Raspberry Pi OS Lite yourself and login (directly or per ssh).

You need to install `git` with

```bash
sudo apt-get update
sudo apt-get install -y git
```

and then clone this repository.

For installing you can use the install script as described earlier.