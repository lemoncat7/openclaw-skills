---
name: docmost
description: "Use when user types /dc, docmost, wiki, 文档, Docmost, or asks to interact with Docmost wiki - reading/writing documents, creating pages, managing spaces."
---

# Docmost Wiki Skill

Docmost 是一个自托管的企业 Wiki 平台（类似 Confluence/Notion）。

## 配置

配置文件: `~/.openclaw/conf/docmost/config.json`

```json
{
  "url": "http://docmost:3000",
  "email": "你的账号邮箱",
  "password": "你的密码"
}
```

## 登录获取 Token

```python
import urllib.request
import json
import http.cookiejar

# 读取配置
config = json.load(open("~/.openclaw/conf/docmost/config.json"))

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

login_data = json.dumps({"email": config["email"], "password": config["password"]}).encode('utf-8')
req = urllib.request.Request(
    f"{config['url']}/api/auth/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
opener.open(req, timeout=10)

token = None
for c in cj:
    if c.name == 'authToken':
        token = c.value
        break
```

## API 端点

| 操作 | 端点 | 方法 |
|------|------|------|
| 获取页面列表 | `/api/pages/recent` | POST |
| 获取页面详情 | `/api/pages/info` | POST |
| 创建页面 | `/api/pages/create` | POST |
| 更新页面内容 | `/api/pages/update` | POST |
| 搜索 | `/api/search/suggest` | POST |

### 通用请求格式

```python
# 所有 API 调用都需要这个 header
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# POST 请求
data = json.dumps({"pageId": "...", "spaceId": "..."}).encode('utf-8')
req = urllib.request.Request(
    f"{config['url']}/api/pages/info",
    data=data,
    headers=headers,
    method="POST"
)
resp = opener.open(req, timeout=10)
result = json.loads(resp.read().decode())
```

## 创建页面

```python
create_data = {
    "spaceId": "空间ID",
    "title": "页面标题",
    "parentPageId": None  # 或父页面ID
}
```

## 更新页面内容

```python
update_data = {
    "pageId": "页面ID",
    "spaceId": "空间ID",
    "content": "# 标题\n\n内容（Markdown）",
    "operation": "replace",  # append, prepend, replace
    "format": "markdown"  # json, markdown, html
}
```

## 获取页面列表

```python
req = urllib.request.Request(
    f"{config['url']}/api/pages/recent",
    data=b"{}",
    headers=headers,
    method="POST"
)
resp = opener.open(req, timeout=10)
pages = json.loads(resp.read().decode())
# pages["data"]["items"] 包含页面列表
```

## 获取页面详情

```python
info_data = {
    "pageId": "页面ID",
    "spaceId": "空间ID"
}
```

## 注意事项

1. POST 请求 body 不能为空，即使没有参数也要传 `{}`
2. Bearer Token 从登录后的 cookie 中获取
3. 页面内容是 JSON 格式，包含 type 和 content 字段
4. 部分 Space 可能只有只读权限
