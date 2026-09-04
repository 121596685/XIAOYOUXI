@echo off
chcp 65001 >nul
echo 正在启动弹幕躲避游戏...
echo.
python --version >nul 2>&1
if %errorlevel% == 0 (
  echo 使用 Python 启动本地服务器...
  start http://localhost:8000
  python -m http.server 8000
) else (
  echo 未检测到 Python，尝试用 Node...
  npx --version >nul 2>&1
  if %errorlevel% == 0 (
    echo 使用 npx serve 启动...
    npx serve -p 8000
  ) else (
    echo 请安装 Python 或 Node.js，或直接双击 index.html
    pause
  )
)
