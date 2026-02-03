# Debug setup

## General setup

Linux machine to work with GitHub and GitLab Repositories.

### Tools installed

- [Visual Studio Code](https://code.visualstudio.com/), you can use any editor
- [Git](https://git-scm.com/)
- [MeGit](https://github.com/eclipsesource/megit), optional
- [Wsl2](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Docker](https://docs.docker.com/engine/install/)

### Directory structure

Example with 3 repositories:

- k13/magicmirror: This repository with the docker setup
- k13/MMM-Flights: A module for MagicMirror²
- foreign/MagicMirror: The MagicMirror² repository

```bash
/
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

MagicMirror² starts as a Linux container with `docker compose run ...`. This command uses the `compose.yaml` (which resides beside this README file).

This `compose.yaml` mounts some directories of the host machine into the container so you have to adjust the left side of these mounts (beginning with `/repo/...`).

```yaml
    volumes:
      # mount local project dir
      - /repo/foreign/MagicMirror:/home/node/magicmirror
```

### Starting debug container

Navigate into the `debug` folder of this repository and use the following `docker compose run ...` command to start the container.

```bash
❯ cd /repo/k13/magicmirror/debug/

magicmirror/debug on  develop [✘!?]
❯ docker compose run --rm --name mm --service-ports magicmirror
node@c45be1e7f6eb:~/magicmirror$
```

Now from inside the container you can start MagicMirror², for example with `node --run server`. You should now see MagicMirror² when you use a browser in your Windows machine and navigate to http://localhost:8080.

## Used container image

The `compose.yaml` uses the container image `registry.gitlab.com/khassel/magicmirror:develop_debug_curr`.

This image contains the `develop` branch of MagicMirror². A scheduled tasks looks twice a day for update of the `develop` branch and rebuild the image if so.

## Use cases

You can use an editor on your Windows machine to edit/adjust code for example in the MagicMirror² Core repository.

### Debug MagicMirror² core (`serveronly`)

```bash
node@e215bb6beca5:~/magicmirror$ node --run server
[2025-11-05 21:20:11.538] [LOG]   [app] Starting MagicMirror: v2.34.0-develop
[2025-11-05 21:20:11.544] [LOG]   [app] Loading config ...
[2025-11-05 21:20:11.553] [LOG]   [app] config template file not exists, no envsubst
...
```

Use a browser and navigate to http://localhost:8080.

Use `Ctrl+C` to stop MagicMirror².

### Debug MagicMirror² core (electron)

You have to adjust some parameters in `compose.yaml` (`XDG_RUNTIME_DIR` environment variable and extra volume mounts, see comments inside `compose.yaml` for details).

```bash
node@e215bb6beca5:~/magicmirror$ node --run start:wayland
[2025-11-05 21:20:54.957] [LOG]   [app] Starting MagicMirror: v2.34.0-develop
[2025-11-05 21:20:54.963] [LOG]   [app] Loading config ...
[2025-11-05 21:20:54.971] [LOG]   [app] config template file not exists, no envsubst
...
```

An electron windows will appear full screen (you can adjust size in electron options in `config.js`).

Use `Ctrl+C` to stop MagicMirror².

### Debug a MagicMirror² module

If you want to debug a specific module, you have to mount it into the container. The `compose.yaml` contains an example with MMM-Flights:

```yaml
    volumes:
      # mount module to test with config
      - /repo/k13/MMM-Flights:/home/node/magicmirror/modules/MMM-Flights
      - /repo/k13/MMM-Flights/debug/config.js:/home/node/magicmirror/config/config.js
```

Beside the module folder you have to mount a special `config.js` additionally.

### Run MagicMirror² tests

The container contains the full test framework, so you can run the tests of the MagicMirror² repository, for example `node --run test:unit`.
