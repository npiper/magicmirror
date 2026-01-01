---
title: Container Images
weight: 3
breadcrumbs: false
externalLinkDecoration: false
---

{{< cards >}}
  {{< card link="https://hub.docker.com/r/karsten13/magicmirror/" title="Image `karsten13/magicmirror` on Docker Hub" image="https://img.shields.io/docker/pulls/karsten13/magicmirror.svg" >}}
{{< /cards >}}

The container image `karsten13/magicmirror` is available with these tags:

TAG                                             | OS/ARCH     | ELECTRON | DISTRO                            | DESCRIPTION
----------------------------------------------- | ----------- | -------- | ----------------------------------|------------------------------------------
**latest** (or {{< param MAGICMIRROR >}})       | linux/amd64 | no       | debian {{< param DEBIANMASTER >}} | for x86, only `serveronly`-mode
**latest** (or {{< param MAGICMIRROR >}})       | linux/arm   | yes      | debian 12                         | for raspberry pi 32-Bit os
**latest** (or {{< param MAGICMIRROR >}})       | linux/arm64 | yes      | debian {{< param DEBIANMASTER >}} | for raspberry pi 64-Bit os
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/amd64 | yes      | debian {{< param DEBIANMASTER >}} | for x86
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/arm   | yes      | debian 12                         | for raspberry pi 32-Bit os
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/arm64 | yes      | debian {{< param DEBIANMASTER >}} | for raspberry pi 64-Bit os
**alpine** (or {{< param MAGICMIRROR >}}_alpine | all 3 archs | no       | alpine                            | only `serveronly`-mode, smaller in size

Version {{< param MAGICMIRROR >}} is the current release of MagicMirror. Older version tags remain on docker hub, the other tags are floating tags and therefore overwritten with every new build. The used Node version is {{< param NODEMASTER >}}.

> [!NOTE]
> The difference between `latest` and `fat` is image size and installed debian packages. For most use cases the `latest` image is sufficient. Some modules need dependencies which are not includes in `latest`, e.g. `python` or compilers, so in such cases you should use `fat`.

> [!CAUTION]
> The following experimental images are not for production use:

TAG                | OS/ARCH                     | ELECTRON | DISTRO                             | DESCRIPTION
------------------ | --------------------------- | -------- | -----------------------------------|------------------------------------------
**develop**        | linux/amd64                 | no       | debian {{< param DEBIANDEVELOP >}} | for x86, only `serveronly`-mode
**develop**        | linux/arm                   | yes      | debian 12                          | for raspberry pi 32-Bit os
**develop**        | linux/arm64                 | yes      | debian {{< param DEBIANDEVELOP >}} | for raspberry pi 64-Bit os
**develop_fat**    | linux/amd64                 | yes      | debian {{< param DEBIANDEVELOP >}} | for x86
**develop_fat**    | linux/arm                   | yes      | debian 12                          | for raspberry pi 32-Bit os
**develop_fat**    | linux/arm64                 | yes      | debian {{< param DEBIANDEVELOP >}} | for raspberry pi 64-Bit os
**develop_alpine** | all 3 archs                 | no       | alpine                             | only `serveronly`-mode, smaller in size

These images are using the `develop` branch of the MagicMirror² git repository and Node version {{< param NODEDEVELOP >}} (except `linux/arm` which has to stay on debian 12 with Node version 22 because newer node images are not available for this architecture).
