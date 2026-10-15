#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf 'Open http://127.0.0.1:8877 in your browser. Press Control-C here to stop the preview.\n'
python3 -m http.server 8877 --bind 127.0.0.1
