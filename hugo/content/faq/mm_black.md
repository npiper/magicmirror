---
title: MagicMirror² is black without content
breadcrumbs: false
---

If you can't access your MagicMirror² (black screen), check the parameters `address` and `ipWhitelist` in your 
`config.js`, see [this forum post](https://forum.magicmirror.builders/topic/1326/ipwhitelist-howto).

You should try the following parameters if you have problems:

```javascript
var config = {
	address: "0.0.0.0",
	port: 8080,
	ipWhitelist: [],
  ...
```
