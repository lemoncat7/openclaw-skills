# Wechat Draft — 微信 API 直发草稿箱

直接用微信 API 发布文章，不依赖第三方工具。自己掌控每一步。

## 核心流程

```
1. 压缩封面 → sharp 转为 300x300 JPEG ≤64KB
2. 上传封面 → material/add_material?type=thumb（不是 media/upload）
3. 写文章 → Markdown 转 HTML
4. 创建草稿 → draft/add
```

## 配置

凭据存 `~/.openclaw/conf/wechat-draft/credentials.json`：

```json
{
  "WECHAT_APP_ID": "wx开头",
  "WECHAT_APP_SECRET": "公众号密钥"
}
```

## 使用

```bash
# 生成 .env（publish.js 从这里读凭据）
python3 -c "
import json, os
with open(os.path.expanduser('~/.openclaw/conf/wechat-draft/credentials.json')) as f:
    c = json.load(f)
with open(os.path.expanduser('~/.openclaw/workspace/.env'), 'w') as f:
    for k, v in c.items():
        f.write(f'{k}={v}\n')
"

# 执行发布（必须在 ~/.openclaw/workspace 下）
cd ~/.openclaw/workspace
node ~/.openclaw/workspace/skills/wechat-draft/publish.js \
  /tmp/article.md \
  /tmp/cover.png \
  "文章标题" \
  "文章摘要"
```

## 已知坑

- **封面**：必须用 `material/add_material?type=thumb`，`media/upload?type=thumb` 返回的 thumb_media_id 创建草稿会报 40007
- **封面格式**：微信要求 JPEG ≤64KB，sharp 压缩到 300x300 再转 JPEG
- **CSS**：使用 doocs/md 主题 CSS（base.css + default.css）

## 微信 API 速查

| 操作 | API |
|------|-----|
| 获取 access_token | `GET /cgi-bin/token?grant_type=client_credential&appid=&secret=` |
| 上传封面缩略图 | `POST /cgi-bin/material/add_material?access_token=&type=thumb` |
| 创建草稿 | `POST /cgi-bin/draft/add?access_token=` |
| 查询草稿 | `POST /cgi-bin/draft/get?access_token=` |
| 删除草稿 | `POST /cgi-bin/draft/delete?access_token=` |