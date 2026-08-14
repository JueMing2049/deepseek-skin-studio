#!/bin/bash
# DeepSeek Skin Studio · macOS 一键注入
# 用法: ./scripts/apply.command [主题id]   例: ./scripts/apply.command galaxy-deep
set -e
THEME="${1:-galaxy-deep}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT=9331

if ! curl -s "http://127.0.0.1:$PORT/json/list" >/dev/null 2>&1; then
  UD="$TMPDIR/dsskin-browser"
  if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    open -a "Google Chrome" --args --remote-debugging-port=$PORT --user-data-dir="$UD" --no-first-run "http://127.0.0.1:3080" &
  elif [ -x "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" ]; then
    open -a "Microsoft Edge" --args --remote-debugging-port=$PORT --user-data-dir="$UD" --no-first-run "http://127.0.0.1:3080" &
  else
    echo "未找到 Chrome / Edge，请手动以 --remote-debugging-port=$PORT 启动浏览器后重试。"
    exit 1
  fi
  echo "已拉起调试浏览器，等待 5 秒…"; sleep 5
fi

node "$DIR/src/cli.mjs" apply --theme "$THEME" --port $PORT
echo "提示: 刷新 DSH 页面后注入消失属预期，重跑本脚本即可。"
