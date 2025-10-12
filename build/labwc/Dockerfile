ARG DEBIAN_VERSION
FROM debian:${DEBIAN_VERSION}-slim

LABEL maintainer="Karsten Hassel"

ENV APP_USER="pi"

RUN <<EOF
set -e
apt-get update
apt-get install -y labwc sudo wlr-randr seatd gojq
apt-get clean
rm -rf /var/lib/apt/lists/*
groupadd -g 1000 $APP_USER
# render has 105 on bookworm but 992 on trixie
groupadd -g 105 renderb
groupadd -g 992 rendert
useradd -u 1000 -g $APP_USER --shell /bin/bash --create-home $APP_USER
# video is needed on e.g. pi2, pi3
# render reduces error messages
usermod -aG video,renderb,rendert,sudo $APP_USER
echo "$APP_USER ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
# some tests:
sudo --version
seatd -v
labwc --version
which wlr-randr
EOF

COPY --chmod=755 entrypoint.sh /entrypoint.sh
COPY transparent /usr/share/icons/Adwaita/cursors/transparent

USER $APP_USER

ENV WLR_LIBINPUT_NO_DEVICES=1 \
    WLR_RENDERER_ALLOW_SOFTWARE=1 \
    LAB_WC_HIDE_CURSOR=true

ENTRYPOINT ["/entrypoint.sh"]
