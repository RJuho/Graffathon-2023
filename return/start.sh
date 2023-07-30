#!/bin/sh

# The demo can be longer than the timeout and it will still work.
# But the timeout should be there so we don't have to manually shut
# down the server after the demo ends. If your demo needs more than
# 30s to load, you can increase the timeout.
timeout 30s python3 -m http.server -d 'dist' 3000 &

# The Linux compo machine doesn't have Chrome, contact us if you need it.
google-chrome --start-fullscreen --new-window 'http://localhost:3000'