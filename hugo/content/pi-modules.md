---
title: Pi Related Modules
weight: 4
breadcrumbs: false
---

Many modules are working out of the box with this container setup. But if you want to use modules which needs hardware of the raspberry pi the setup can be tricky.

# MagicMirror² with PIR motion sensor

## Install module MMM-Universal-Pir

Start this setup with scenario **electron** ✌️and with a labwc(wayland) setup on your raspberry pi (or using this setup with `labwc` container). Login into the mm container with `docker exec -it mm bash`. Navigate to the `modules` folder and clone [MMM-Universal-Pir](https://gitlab.com/khassel/MMM-Universal-Pir) with `git clone https://gitlab.com/khassel/MMM-Universal-Pir.git`.

## Configure MMM-Universal-Pir

Every module needs to be configured in the `config.js` file. Here is my config for testing the module:

```javascript
  {
    module: "MMM-Universal-Pir",
    position: "top_right",
    config: {
      gpioCommand: "gpiomon -e rising -c 0 23",
      onCommand: "wlr-randr --output HDMI-A-1 --on",
      offCommand: "wlr-randr --output HDMI-A-1 --off",
      deactivateDelay: 20 * 1000,
    }
  }
```

The last parameter in the `gpioCommand` is the gpio pin where you plugged in the motion sensor, you have to adjust this number.
If you are using another HDMI port you have to adjust the on/off commands, you can run `wlr-randr` and find the HDMI port in the first line of the output (in above example `HDMI-A-1`). After updating the `config.js` you have to restart the container.

After restart the PIR-Sensor should work, you should see the countdown in the upper right corner.
You can interrupt the countdown by waking the sensor up. After 20 sec. without motion the screen should go off, you can wake up the screen with the sensor.

## Debugging

If something is not working you can test the above commands locally on the host.

`gpiomon -e rising -c 0 23` should provide some output if you touch the sensor, the `wlr-randr` commands should enable/disable the screen.

If they are working start the container and login with `docker exec -it mm bash` and try the same commands in the container. The container is running `privileged` so if the commands are not working inside could indicate a missing group.

## Labwc(Wayland) and XServer

This example was made assuming that Labwc(Wayland) is used. If you are using XServer/X11/Xorg you have to replace the `wlr-randr` commands with corresponding `xrandr` commands.

## Running unprivileged

With scenario **electron** ✌️ the container is started privileged. This is needed here for allowing the container to execute the above commands. If you want to run unprivileged you have to figure out which devices (and volumes) are needed and map them in your `compose.yaml`.

## Other hardware related modules

If you are missing binaries (e.g. `python`) which are needed by a module see [this section in the FAQ](/faq/dependencies/).
