# Debug Setup

## General Setup

I use a Windows machine to work with Github and Gitlab Repositories.

### Tools installed in Windows

- [Visual Studio Code](https://code.visualstudio.com/), you can use any editor
- [Git](https://git-scm.com/)
- [GitExtensions](https://gitextensions.github.io/), optional
- [Wsl2](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Docker Desktop](https://docs.docker.com/desktop/)
- [MobaXterm](https://mobaxterm.mobatek.net/), you can use any ssh program

### Directory Structure in Windows

As example I use 3 repositories:

- k13/magicmirror: This repository with the docker setup
- k13/MMM-Flights: A module for MagicMirror²
- foreign/MagicMirror: The MagicMirror² repository

```bash
C:
└─data
  └─repo
    └─foreign
    | └─MagicMirror
    └─k13
      └─magicmirror
      | └─debug
      |   └─compose.yaml
      └─MMM-Flights
        └─debug
          └─config.js
```
### Update the `compose.yaml`

MagicMirror² is started as Linux container in Wsl2. I have a debian distro running in Wsl2 and use MobaXterm to ssh into Wsl2 (you can use any ssh program). Drive `C:\` from Windows is mounted in Wsl2 under `/mnt/c`.

We use `docker compose run ...` later to start the container. This command uses the `compose.yaml` (which resides beside this README file).

This `compose.yaml` mounts some directories of the Windows machine into the container so you have to adjust the left side of these mounts (beginning with `/mnt/c/...`).

```yaml
    volumes:
      # mount local project dir
      - /mnt/c/data/repo/foreign/MagicMirror:/home/node/magicmirror
```

### Starting Debug Container

Navigate into the `debug` folder of this repository and use the following `docker compose run ...` command to start the container.

```bash
❯ cd /mnt/c/data/repo/k13/magicmirror/debug/

magicmirror/debug on  develop [✘!?]
❯ docker compose run --rm --name mm --service-ports magicmirror
node@c45be1e7f6eb:~/magicmirror$
```

Now we are in the container and can start MagicMirror², e.g. with `node --run server`. You should now see MagicMirror² when you use a browser in your Windows machine and navigate to http://localhost:8080.

## Used Container Image

In the `compose.yaml` we use the container image `registry.gitlab.com/khassel/magicmirror:develop_debug25`. The last number is the used nodejs version, at the moment there are 2 images (`25` and `24`).

This image contains the `develop` branch of MagicMirror². There is a scheduled tasks which looks twice a day if the `develop` branch was updated and rebuild the image if so.

## Use Cases

You can use an editor on your Windows machine to edit/adjust code e.g. in the MagicMirror² Core repository.

### Debug MagicMirror² Core (serveronly)

```bash
node@e215bb6beca5:~/magicmirror$ node --run server
[2025-11-05 21:20:11.538] [LOG]   [app] Starting MagicMirror: v2.34.0-develop
[2025-11-05 21:20:11.544] [LOG]   [app] Loading config ...
[2025-11-05 21:20:11.553] [LOG]   [app] config template file not exists, no envsubst
...
```

Use a browser and navigate to http://localhost:8080.

Use `Ctrl+C` to stop MagicMirror².

### Debug MagicMirror² Core (electron)

```bash
node@e215bb6beca5:~/magicmirror$ node --run start:wayland
[2025-11-05 21:20:54.957] [LOG]   [app] Starting MagicMirror: v2.34.0-develop
[2025-11-05 21:20:54.963] [LOG]   [app] Loading config ...
[2025-11-05 21:20:54.971] [LOG]   [app] config template file not exists, no envsubst
...
```

An electron windows will appear fullscreen (you can adjust size in electron options in `config.js`).

Use `Ctrl+C` to stop MagicMirror².

### Debug a MagicMirror² module

If you want to debug a specific module, you have to mount it into the container. The `compose.yaml` contains an example with MMM-Flights:

```yaml
    volumes:
      # mount module to test with config
      - /mnt/c/data/repo/k13/MMM-Flights:/home/node/magicmirror/modules/MMM-Flights
      - /mnt/c/data/repo/k13/MMM-Flights/debug/config.js:/home/node/magicmirror/config/config.js
```

Beside the module folder a special `config.js` is mounted additionally.

### Run MagicMirror² tests

The container contains the full test framework, so you can run the tests of the MagicMirror² repository, e.g. `node --run test:unit`.

If you run the electron tests you should to this with

```bash
export XDG_RUNTIME_DIR=/tmp
labwc &
node --run test:electron
```

Otherwise the electron window will popup with every test.

### Running `npm install`

If you need to update dependencies you can run `npm install` inside the container. This will work but is very slow because the linux container is writing into a windows filesystem.

Better choice is to run `npm -g install` in this setup which uses another directory inside the container.