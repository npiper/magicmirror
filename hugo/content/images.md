---
title: Container Images
weight: 3
breadcrumbs: false
externalLinkDecoration: false
---

{{< cards >}}
  {{< card link="https://hub.docker.com/r/karsten13/magicmirror/" title="Image `karsten13/magicmirror` on Docker Hub" image="https://img.shields.io/docker/pulls/karsten13/magicmirror.svg" >}}
{{< /cards >}}

The container image `karsten13/magicmirror` exists with the following tags:

TAG                                             | OS/ARCH             | ELECTRON | DISTRO                            | DESCRIPTION
----------------------------------------------- | ------------------- | -------- | ----------------------------------|------------------------------------------
**latest** (or {{< param MAGICMIRROR >}})       | linux/amd64         | no       | Debian {{< param DEBIANMASTER >}} | for x86, only `serveronly`-mode
**latest** (or {{< param MAGICMIRROR >}})       | linux/arm           | yes      | Debian 12                         | for Raspberry Pi 32-Bit OS
**latest** (or {{< param MAGICMIRROR >}})       | linux/arm64         | yes      | Debian {{< param DEBIANMASTER >}} | for Raspberry Pi 64-Bit OS
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/amd64         | yes      | Debian {{< param DEBIANMASTER >}} | for x86
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/arm           | yes      | Debian 12                         | for Raspberry Pi 32-Bit OS
**fat** (or {{< param MAGICMIRROR >}}_fat)      | linux/arm64         | yes      | Debian {{< param DEBIANMASTER >}} | for Raspberry Pi 64-Bit OS
**alpine** (or {{< param MAGICMIRROR >}}_alpine | all 3 architectures | no       | Alpine                            | only `serveronly`-mode, smaller in size

Version {{< param MAGICMIRROR >}} represents the current release of MagicMirror. Older version tags remain on docker hub. Other tags floats, every new build overwrites the existing ones. Used Node version: {{< param NODEMASTER >}}.

> [!NOTE]
> Differences between `latest` and `fat`: Image size and installed Debian packages. For most use cases the `latest` image should meet your requirements. `latest` maybe lacks dependencies needed by some modules, for example `python` or compilers, so in such cases you should use `fat`.

> [!CAUTION]
> Don't use the following experimental images in production:

TAG                | OS/ARCH                     | ELECTRON | DISTRO                             | DESCRIPTION
------------------ | --------------------------- | -------- | -----------------------------------|------------------------------------------
**develop**        | linux/amd64                 | no       | Debian {{< param DEBIANDEVELOP >}} | for x86, only `serveronly`-mode
**develop**        | linux/arm                   | yes      | Debian 12                          | for Raspberry Pi 32-Bit OS
**develop**        | linux/arm64                 | yes      | Debian {{< param DEBIANDEVELOP >}} | for Raspberry Pi 64-Bit OS
**develop_fat**    | linux/amd64                 | yes      | Debian {{< param DEBIANDEVELOP >}} | for x86
**develop_fat**    | linux/arm                   | yes      | Debian 12                          | for Raspberry Pi 32-Bit OS
**develop_fat**    | linux/arm64                 | yes      | Debian {{< param DEBIANDEVELOP >}} | for Raspberry Pi 64-Bit OS
**develop_alpine** | all 3 architectures         | no       | Alpine                             | only `serveronly`-mode, smaller in size

These images use the `develop` branch of the MagicMirror² git repository and Node version {{< param NODEDEVELOP >}}. Except `linux/arm` which has to stay on Debian 12 with Node version 22. Node maintains no newer versions for this architecture.
