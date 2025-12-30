#!/bin/sh

modules_dir="${MM_DIR}/modules"
default_dir="${modules_dir}/default"
config_dir="${MM_DIR}/config"
css_dir="${MM_DIR}/css"

_info() {
  echo "[entrypoint $(date +%T.%3N)] [INFO]  $1"
}

_error() {
  echo "[entrypoint $(date +%T.%3N)] [ERROR] $1"
}

_start_mm() {
  if [ "$(id -u)" = "0" ]; then
    _info "running as root but starting the magicmirror process with uid=1000"
    # directories must be writable by user node:
    chown -R node:node "$modules_dir" "$config_dir" "$css_dir"
    _file="mm.env"
    rm -f $_file
    echo "export START_CMD=\"$@\"" > $_file
    for _line in $(env); do
      if echo "$_line" | grep -Eq '^(XDG.*|.*DISPLAY.*|MM_.*|NODE.*|DBUS.*|ELECTRON.*|TZ.*)$'; then
        echo "export $_line" >> $_file
      fi
    done
    exec su - node -c 'cd /opt/magic_mirror; . '$_file'; $START_CMD'
  else
    exec "$@"
  fi
}

if [ -z "$TZ" ]; then
  . /etc/os-release
  export TZ
  TZ="$(wget -qO - http://geoip.ubuntu.com/lookup | sed -n -e 's/.*<TimeZone>\(.*\)<\/TimeZone>.*/\1/p')"
  if [ "$VERSION_CODENAME" = "bookworm" ]; then
    if [ -w /etc/localtime ]; then
      ln -fs "/usr/share/zoneinfo/$TZ" /etc/localtime
    else
      _info "***WARNING*** could not write to /etc/localtime"
    fi
    if [ -w /etc/timezone ]; then
      echo "$TZ" > /etc/timezone
    else
      _info "***WARNING*** could not write to /etc/timezone"
    fi
  fi
fi

if [ -z "$TZ" ]; then
  _info "***WARNING*** could not set timezone, please set TZ variable in compose.yaml, see https://khassel.gitlab.io/magicmirror/configuration/#timezone"
fi

if [ "${MM_OVERRIDE_DEFAULT_MODULES}" = "true" ]; then
  mkdir -p "${modules_dir}"
  if [ -w "${modules_dir}" ]; then
    if test -d "${default_dir}" && ! test -L "${default_dir}"; then
      # if it's a real directory (not a symlink) then move it away
      _info "renaming default modules to default-save"
      rm -rf "${modules_dir}/default-save"
      mv "${default_dir}" "${modules_dir}/default-save"
    fi
    _info "symlink default modules"
    ln -sf "${MM_DIR}/__modules/default" "${MM_DIR}/modules"
  else
    _error "No write permission for ${modules_dir}, skipping symlinking default modules"
  fi
fi

[ ! -f "${css_dir}/main.css" ] && MM_OVERRIDE_CSS=true

if [ "${MM_OVERRIDE_CSS}" = "true" ]; then
  if [ -w "${css_dir}" ]; then
    _info "copy css files"
    cp "${MM_DIR}/__css/*" "${css_dir}/"
  else
    _error "No write permission for ${css_dir}, skipping copying css files"
  fi
fi

# create css/custom.css file https://github.com/MagicMirrorOrg/MagicMirror/issues/1977
[ ! -f "${css_dir}/custom.css" ] && touch "${css_dir}/custom.css"

if [ ! -f "${config_dir}/config.js" ]; then
  mkdir -p "${config_dir}"
  if [ -w "${config_dir}" ]; then
    _info "copy default config.js"
    cp "${MM_DIR}/__config/config.js.sample" "${config_dir}/config.js"
  else
    _error "No write permission for ${config_dir}, skipping copying config.js"
  fi
fi

if [ "$MM_SHOW_CURSOR" = "true" ]; then
  _info "enable mouse cursor"
  sed -i "s|  cursor: .*;|  cursor: auto;|" "${MM_DIR}/css/main.css"
fi

[ -z "$MM_RESTORE_SCRIPT_CONFIG" ] || ("${MM_DIR}/create_restore_script.sh" "$MM_RESTORE_SCRIPT_CONFIG" || true)

if [ "$STARTENV" = "test" ]; then
  set -e

  export NODE_ENV=test

  _info "start tests"

  export XDG_RUNTIME_DIR=/tmp/labwc
  mkdir -p $XDG_RUNTIME_DIR
  WLR_BACKENDS=headless WLR_LIBINPUT_NO_DEVICES=1 WLR_RENDERER=pixman labwc &
  export WAYLAND_DISPLAY=wayland-0

  cd "${MM_DIR}"
  
  node --run test:prettier
  node --run test:js
  node --run test:css
  node --run test:markdown
  node --run test:unit
  node --run test:e2e
  node --run test:electron
else
  _script=""
  if [ -f "start_script.sh" ]; then
    _script="${MM_DIR}/start_script.sh"
  elif [ -f "config/start_script.sh" ]; then
    _script="${MM_DIR}/config/start_script.sh"
  elif [ -f "/config/start_script.sh" ]; then
    _script="/config/start_script.sh"
  fi
  if [ -n "$_script" ]; then
    if [ ! -x "$_script" ] && [ -w "$_script" ] ; then
      chmod +x "$_script"
    fi

    if [ -x "$_script" ]; then
      _info "executing script $_script"
      . "$_script"
    else
      _error "script $_script is not executable and no permissions to change this"
    fi
  fi

  if [ $# -eq 0 ]; then
    # if no params are provided ...
    if [ -z "$MM_SCENARIO" ]; then
      # ... and no scenario set, then add defaults depending if electron is installed:
      if command -v node_modules/.bin/electron > /dev/null; then
        if [ -S "$XDG_RUNTIME_DIR/wayland-0" ]; then
          _start_mm node --run start:wayland
        else
          _start_mm node --run start
        fi
      else
        _start_mm node --run server
      fi
    else
      # ... add defaults depending of the scenario:
      if [ "$MM_SCENARIO" = "electron" ]; then
        if [ -S "$XDG_RUNTIME_DIR/wayland-0" ]; then
          _start_mm node --run start:wayland
        else
          _start_mm node --run start
        fi
      else
        _start_mm node --run server
      fi
    fi
  else
    _start_mm "$@"
  fi
fi
