# Wallboard — Custom MagicMirror² image for AWS deployment
#
# Build context: infrastructure/
# Bakes config, CSS and MMM-CalendarExt3 into the image.
# GCAL_SECRET_URL is NOT embedded here — it is injected at runtime
# via ECS task definition secrets (from AWS Secrets Manager).

FROM karsten13/magicmirror:latest

# Force server-only mode — the entrypoint detects electron is installed and tries to launch
# it (MM_SCENARIO=electron), but the electron binary is not extracted in headless/ECS builds.
# Setting MM_SCENARIO=server bypasses that check entirely.
ENV MM_SCENARIO=server

# Create config dir with write access so entrypoint can run envsubst and write config.js
RUN mkdir -p /opt/magic_mirror/config && chmod a+w /opt/magic_mirror/config

# Copy wallboard configuration and CSS
COPY config.js     /opt/magic_mirror/config/config.js.template
COPY custom.css    /opt/magic_mirror/css/custom.css

# Install MMM-CalendarExt3
RUN cd /opt/magic_mirror/modules \
    && git clone https://github.com/MMRIZE/MMM-CalendarExt3.git \
    && cd MMM-CalendarExt3 \
    && npm install --production \
    && cd /opt/magic_mirror

# Install MMM-CustomElementTime (no postinstall, lightweight)
RUN cd /opt/magic_mirror/modules \
    && git clone https://github.com/MMRIZE/MMM-CustomElementTime.git \
    && cd /opt/magic_mirror

# Install MMM-CountEvents (postinstall.sh must be chmod +x before npm install)
RUN cd /opt/magic_mirror/modules \
    && git clone https://github.com/MMRIZE/MMM-CountEvents.git \
    && cd MMM-CountEvents \
    && chmod +x postinstall.sh \
    && npm install --production \
    && cd /opt/magic_mirror

WORKDIR /opt/magic_mirror
