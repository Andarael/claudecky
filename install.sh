#!/bin/sh
# Copy the built plugin into Decky and restart the loader. Run with sudo.
set -e
cd "$(dirname "$0")"
dest=/home/deck/homebrew/plugins/claudecky
mkdir -p "$dest"
cp -r dist main.py plugin.json package.json "$dest"/
systemctl restart plugin_loader
