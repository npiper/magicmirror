---
title: "Error: Cannot find module `request`"
breadcrumbs: false
---

MagicMirror² Version v2.16.0 removed the dependency `request`. The maintainer deprecated `request` so still using it implies security risks (see [npm request](https://www.npmjs.com/package/request)). This should no problem for modules using `request` but some modules didn't setup `request` in there own `package.json`, they did rely on that this dependency comes with MagicMirror.

If your container doesn't start with MagicMirror² v2.16.0 or later and you find something like

```bash
"Error: `Cannot find module request`"
```
in the logs you should open an issue in the module project to get this fixed.

Example log of module MMM-quote-of-the-day:
```bash
[22.07.2021 12:16.03.454] [LOG]   Starting MagicMirror: v2.16.0
[22.07.2021 12:16.03.462] [LOG]   Loading config ...
[22.07.2021 12:16.03.474] [LOG]   Loading module helpers ...
[22.07.2021 12:16.03.497] [ERROR] WARNING! Could not load config file. Starting with default configuration. Error found: Error: `Cannot find module request`
Require stack:
- /opt/magic_mirror/modules/MMM-quote-of-the-day/node_helper.js
- /opt/magic_mirror/js/app.js
- /opt/magic_mirror/serveronly/index.js
[22.07.2021 12:16.03.499] [LOG]   Loading module helpers ...
[22.07.2021 12:16.03.504] [ERROR] Whoops! There was an uncaught exception...
[22.07.2021 12:16.03.514] [ERROR] Error: `Cannot find module request`
Require stack:
- /opt/magic_mirror/modules/MMM-quote-of-the-day/node_helper.js
- /opt/magic_mirror/js/app.js
- /opt/magic_mirror/serveronly/index.js
```

To get your MagicMirror² running you can use the following workaround:
- login into the container with `docker exec -it mm bash` and navigate into the folder of the module, for example `cd modules/MMM-quote-of-the-day`
- check with `ls -la` if the folder contains a file `package.json`, if not run `npm init -y`
- run `npm install request`

After this manual install of `request` the module should work.

The changes done persists because the content of the `modules` folder lies on the host (volume mount). If you do a fresh install of such a module you have to repeat this procedure.
