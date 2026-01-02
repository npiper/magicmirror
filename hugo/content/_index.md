---
# title: MagicMirror² Container Setup
toc: false
cascade:
  type: docs
---

![MagicMirror²: The open source modular smart mirror platform. ](./images/header.png)

# MagicMirror²

You find more information on the [project website](https://github.com/MagicMirrorOrg/MagicMirror). This project packs MagicMirror² into a container image.

# Why containers

Using containers simplifies the setup by using the container image instead of setting up the host with installing all the node.js stuff etc.
For getting or updating the image you have to execute only one command.

Three use cases:
- Scenario **server** ☝️: Running the application in server only mode.

  This will start the server, after which you can open the application in your browser of choice.
  Useful for testing or running the application somewhere online, so you can access it with a browser from everywhere.

- Scenario **electron** ✌️: Using containers on the raspberry pi and starting the MagicMirror² on the screen of the pi using electron.

- Scenario **client** 👌: Using containers on the raspberry pi and starting the MagicMirror² on the screen of the pi using another running MagicMirror² instance.
