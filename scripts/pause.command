#!/bin/bash
# DeepSeek Skin Studio · macOS 恢复原生外观
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
node "$DIR/src/cli.mjs" pause --port 9331 || node "$DIR/src/cli.mjs" pause --port 9222
