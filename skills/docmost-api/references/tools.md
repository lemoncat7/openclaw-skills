# Docmost MCP 工具参考

## 20 个可用工具

### 页面操作

| 工具 | 描述 | 必填参数 |
|------|------|----------|
| `search_pages` | 全文搜索页面 | `query` |
| `get_page` | 获取页面内容 | `pageId` |
| `create_page` | 创建页面 | `spaceId`, `title` |
| `update_page` | 更新页面 | `pageId` |
| `list_pages` | 列出所有页面 | - |
| `list_child_pages` | 列出子页面 | - |
| `duplicate_page` | 复制页面 | `pageId` |
| `copy_page_to_space` | 跨空间复制 | `pageId`, `spaceId` |
| `move_page` | 移动页面 | `pageId` |
| `move_page_to_space` | 跨空间移动 | `pageId`, `spaceId` |

### 空间操作

| 工具 | 描述 | 必填参数 |
|------|------|----------|
| `get_space` | 获取空间信息 | `spaceId` |
| `list_spaces` | 列出所有空间 | - |
| `create_space` | 创建空间 | `name` |
| `update_space` | 更新空间 | `spaceId` |

### 协作功能

| 工具 | 描述 | 必填参数 |
|------|------|----------|
| `get_comments` | 获取评论 | `pageId` |
| `create_comment` | 创建评论 | `pageId`, `content` |
| `update_comment` | 更新评论 | `commentId`, `content` |

### 其他

| 工具 | 描述 | 必填参数 |
|------|------|----------|
| `search_attachments` | 搜索附件 | `query` |
| `list_workspace_members` | 列出成员 | - |
| `get_current_user` | 获取当前用户 | - |

## 参数详解

### search_pages
```json
{
  "query": "搜索关键词",
  "spaceId": "UUID（可选，限定空间）",
  "limit": 10,
  "offset": 0
}
```

### get_page
```json
{
  "pageId": "UUID 或 slugId",
  "format": "markdown|html|json"
}
```

### create_page
```json
{
  "spaceId": "UUID（必填）",
  "title": "页面标题",
  "content": "Markdown 内容",
  "parentPageId": "UUID（可选，父页面）",
  "format": "markdown|html|json"
}
```

### update_page
```json
{
  "pageId": "UUID",
  "title": "新标题（可选）",
  "content": "新内容（可选）",
  "operation": "replace|append|prepend",
  "format": "markdown|html|json"
}
```

## UUID 格式
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
可用 slugId（URL 中的短 ID）替代，如 `rxrKKwqOdQ`

## 空间 ID
- M-General: `0198954f-5807-72e1-81a5-2b98d6532f4c`
- N-General: `019c5093-9507-7eb4-8f96-1574b7086156`
- 共享文档: `019896d3-4ae1-7662-a03a-4daf856f36b0`
- 工作空间: `019abef9-e9c4-71ec-ae29-9e6eb18bc98a`
