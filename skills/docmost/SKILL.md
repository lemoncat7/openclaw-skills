---
name: docmost
description: Docmost 文档平台 MCP 工具封装。用于读写 Docmost 文档、页面、空间。当需要创建文档、读取页面、更新内容、搜索文档、在 Docmost 中读写内容时使用此技能。关键词：Docmost、文档、页面、workspace、space、read page、create doc、update content。
---

# Docmost MCP Skill

通过 MCP 协议读写 Docmost 文档平台。

## 配置

API 密钥和工作区信息已配置在 `~/.openclaw/conf/docmost/config.json`。

MCP 服务器地址：`http://docmost:3000/mcp`

## 核心脚本

### `scripts/mcp_call.sh` — MCP JSON-RPC 调用

```bash
./scripts/mcp_call.sh <method> <tool_name> [json_args]

# method: tools/list 或 tools/call
# tool: 工具名称
# json_args: JSON 格式参数（可选，省略则用 {}）
```

**返回格式：** JSON（已解析）

**示例：**
```bash
# 列出所有空间
./scripts/mcp_call.sh tools/call list_spaces

# 搜索页面
./scripts/mcp_call.sh tools/call search_pages '{"query":"关键词","limit":10}'

# 创建页面
./scripts/mcp_call.sh tools/call create_page '{"spaceId":"UUID","title":"标题","content":"内容"}'

# 获取页面
./scripts/mcp_call.sh tools/call get_page '{"pageId":"UUID或slugId","format":"markdown"}'

# 更新页面
./scripts/mcp_call.sh tools/call update_page '{"pageId":"UUID","content":"新内容","operation":"replace"}'

# 列出页面
./scripts/mcp_call.sh tools/call list_pages '{"spaceId":"UUID"}'

# 移动页面
./scripts/mcp_call.sh tools/call move_page '{"pageId":"UUID","parentPageId":null}'
```

### `scripts/docmost.sh` — 高级封装

```bash
./scripts/docmost.sh <command> [args...]

命令：
  list-spaces                            列出所有空间
  list-pages <spaceId> [limit]           列出空间中的页面
  get-page <pageId> [format]            获取页面内容（默认 markdown）
  create-page <spaceId> <title> [content] 创建页面
  update-page <pageId> <content> [op]    更新页面（replace/append/prepend）
  search <query> [limit]                 搜索页面
  create-space <name> [desc]            创建空间
  move-page <pageId> [parentPageId]     移动页面
```

## 可用工具列表

参考 `references/tools.md`

## 常用空间 ID

- **M-General**: `0198954f-5807-72e1-81a5-2b98d6532f4c`
- **N-General**: `019c5093-9507-7eb4-8f96-1574b7086156`
- **共享文档**: `019896d3-4ae1-7662-a03a-4daf856f36b0`
- **工作空间**: `019abef9-e9c4-71ec-ae29-9e6eb18bc98a`

## 工作流程

1. 先 `list-spaces` 或 `list-pages` 查看现有内容
2. 用 `search` 找特定文档
3. 用 `get-page` 读取内容
4. 用 `create-page` 或 `update-page` 创建/更新
5. 成功后在 Docmost Web UI 中验证

## 注意事项

- `spaceId` 和 `pageId` 都是 UUID 格式
- `pageId` 也可以用 `slugId`（URL 中的短 ID）
- `format` 可选：`markdown`（默认）、`html`、`json`
- `operation` 可选：`replace`（默认）、`append`、`prepend`
- 创建页面后返回 `id` 和 `slugId`，可用 `https://doc.mochencloud.cn:1443/{slugId}` 访问
