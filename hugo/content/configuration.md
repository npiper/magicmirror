---
title: Configuration
weight: 2
breadcrumbs: false
---

## Configuration, Modules, and custom CSS

After the first start of the container you find 3 directories
```bash
~/magicmirror/mounts/config
~/magicmirror/mounts/modules
~/magicmirror/mounts/css
```

`config` contains the `config.js`, you find more information [here](https://docs.magicmirror.builders/configuration/introduction.html).

You can also use a `config.js.template` instead which can contain environment variables (impossible in `config.js`).
This make sense for keeping secrets (for example passwords, api-keys) out of the configuration file. In `config.js.template` you can use shell variable syntax for example `${MY_SECRET}` as placeholder for your secrets. Don't forget to pass variables in `config.js.template` as environment variables to the container:
```yaml
    environment:
      MY_SECRET: "abc"
```

You can also use the `.env` file (in the same directory as your `compose.yaml`) to define your secrets there, for more info on this see [the docker compose reference](https://docs.docker.com/compose/environment-variables/).

> [!WARNING]
> While starting the container creates the `config.js` using the `config.js.template`. It overwrites an existing `config.js` and saves it as `config.js-old`

For installing modules refer to the module website, you find the documentation of the default modules [here](https://docs.magicmirror.builders/modules/introduction.html).

> [!IMPORTANT]
> Installing or updating modules differs compared to a standard setup: You must do the `git clone ...`, `git pull` and `npm install` commands from inside the running container. For this you execute `docker exec -it mm bash` and in this shell you navigate to the `modules/MMM-...` folder. For exiting from the container you type `exit`.

`css` contains the `custom.css` file, which you can use to override your
modules' appearance. For CSS basics please refer to
[this forum article](https://forum.magicmirror.builders/topic/6808/css-101-getting-started-with-css-and-understanding-how-css-works), among many other places.

## Default modules

You find the default modules of MagicMirror² in the sub folder `modules/default`. These modules belong to the MagicMirror² project. Other modules (3rd-party) have their own git repositories. Because this setup needs the folder `modules` mounted on the host this setup creates a symlink for the `default` folder. This symlink points to a location inside the container (containing the `default` stuff of the repository).

Who doesn't agree with this procedure can avoid the symlinking process by setting the environment variable `MM_OVERRIDE_DEFAULT_MODULES` to `false` in the `.env` file:
```bash
MM_OVERRIDE_DEFAULT_MODULES="false"
```

If you choose `MM_OVERRIDE_DEFAULT_MODULES="false"` you must provide your own version of the `default` folder as sub folder under `~/magicmirror/mounts/modules` on the host.

## Timezone

The container tries to get the timezone by location. If this doesn't work you can set the timezone to a different value by editing the `compose.yaml` file. You have to add the timezone as environment variable:

```yaml
    environment:
      TZ: Europe/Berlin
```

## Mouse cursor

MagicMirror² disables the mouse cursor by default. You can enable it by setting the environment variable `MM_SHOW_CURSOR` to `true` in your `.env` file:
```bash
MM_SHOW_CURSOR="true"
```
