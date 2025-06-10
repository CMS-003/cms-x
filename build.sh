#!/bin/bash

# 1. 解析 --app 参数
for arg in "$@"; do
  case $arg in
    --app=*)
      APP_NAME="${arg#*=}"
      shift
      ;;
  esac
done

if [ -z "$APP_NAME" ]; then
  echo "❌ 缺少 --app 参数"
  exit 1
fi

echo "🚀 开始构建应用：$APP_NAME"

# 2. 替换文件中的 demo（假设是 src/config.js，你可以替换成其他路径）
TARGET_FILE=".env"
if [ ! -f "$TARGET_FILE" ]; then
  echo "❌ 文件不存在: $TARGET_FILE"
  exit 1
fi

# 使用 sed 替换所有 demo 为 APP_NAME（兼容 macOS 和 Linux）
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/demo/$APP_NAME/g" "$TARGET_FILE"
else
  sed -i "s/demo/$APP_NAME/g" "$TARGET_FILE"
fi
TARGET_FILE="public/manifest.json"
if [ ! -f "$TARGET_FILE" ]; then
  echo "❌ 文件不存在: $TARGET_FILE"
  exit 1
fi

# 使用 sed 替换所有 demo 为 APP_NAME（兼容 macOS 和 Linux）
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/demo/$APP_NAME/g" "$TARGET_FILE"
else
  sed -i "s/demo/$APP_NAME/g" "$TARGET_FILE"
fi

echo "✅ 已将 demo 替换为 $APP_NAME"

# 3. 构建项目
npm run build

# 4. 重命名 build 文件夹
if [ -d "$APP_NAME" ]; then
  rm -rf "$APP_NAME"
fi

mv build "$APP_NAME"

git checkout .env
git checkout .gitignore
git checkout public/manifest.json

echo "✅ 构建完成，输出目录已重命名为：$APP_NAME"