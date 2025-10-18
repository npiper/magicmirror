#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

_info() {
  echo -e "\n${GREEN}${1}${NC}\n"
}

_error() {
  echo -e "\n${RED}${1}${NC}\n"
  exit 1
}

_checkparams(){
  if [[ "$1" =~ ^(electron|server|client)$ ]]; then
    scenario="$1"
  else
    echo ""
    echo 'This script needs the scenario (out of "electron" or "server" or "client") as only parameter.'
    echo "See documentation for more details: https://khassel.gitlab.io/magicmirror/"
    _error "Invalid parameter $1"
  fi
}

_checkparams "$1"

# get magicmirror directory as base
base="$(dirname $(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd))"
branch=$(git rev-parse --abbrev-ref HEAD)
_sudo=""
_uid="$(id -u)"

_info "--> Installing docker"

if command -v docker > /dev/null; then
  echo "docker is already installed:"
  docker -v
  docker compose version
else
  # install docker using official convenience script
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm -f get-docker.sh

  # postinstall docker, add current user to group "docker"
  sudo usermod -aG docker $USER
  _sudo="sudo"
fi

if [[ -d "/run/systemd" && "$_uid" == "0" ]]; then
  for ((i=1;i<=20;i++)); do
    if [[ -f "/run/systemd/timesync/synchronized" ]]; then
      break
    fi
    [[ i -eq 1 ]] && echo "waiting for timesync " || echo -n "."
    sleep 5s
  done
fi

cd "$base/run"

[[ -f "compose.yaml" ]] || cp original.compose.yaml compose.yaml
if [[ ! -f ".env" ]]; then
  _info "--> Magicmirror container setup for scenario $scenario"

  echo "creating .env file"

  cp original.env .env

  # if not on master use develop image
  if [[ "$branch" != "master" ]]; then
    echo "we are not on the master branch so using image karsten13/magicmirror:develop"
    sed -i 's|MM_IMAGE=.*|MM_IMAGE="karsten13/magicmirror:develop"|g' .env
    sed -i 's|LABWC_IMAGE=.*|LABWC_IMAGE="karsten13/labwc:develop"|g' .env
  fi

  # set scenario:
  sed -i 's|MM_SCENARIO=.*|MM_SCENARIO="'$scenario'"|g' .env
  if [[ "$scenario" == "client" ]]; then
    sed -i 's|MM_INIT=.*|MM_INIT="no"|g' .env
  else
    sed -i 's|MM_INIT=.*|MM_INIT="init"|g' .env
  fi

  sed -i 's|MM_LABWC=.*|MM_LABWC="no"|g' .env
  if [[ "$scenario" == "electron" ]]; then
    if ! xset -q > /dev/null 2>&1 && ! command -v labwc > /dev/null 2>&1; then
      # use own labwc
      echo "found no xserver or wayland so using own container"
      sed -i 's|MM_LABWC=.*|MM_LABWC="labwc"|g' .env
    fi
  fi
fi

_info "--> Pulling container images and starting magicmirror"
# need sudo for docker here if docker was installed with this script

# use up so mm can start if there are already local images
$_sudo docker compose up -d

if [[ "$_uid" == "0" ]]; then
  # pull new images
  $_sudo docker compose pull
  # restart (only if new images pulled)
  $_sudo docker compose up -d
  # cleanup when running as root
  $_sudo docker image prune -f
fi

if [[ "$_sudo" == "sudo" ]]; then
  _info "--> Reboot needed, starting in 20 sec. (use ctrl-c to skip)"
  sleep 20
  sudo reboot now
fi
