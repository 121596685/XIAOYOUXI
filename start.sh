#!/bin/bash
echo "正在启动弹幕躲避游戏..."
if command -v python3 &> /dev/null; then
  open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null
  python3 -m http.server 8000
elif command -v python &> /dev/null; then
  python -m http.server 8000
else
  echo "请安装 Python，或直接双击 index.html"
fi
