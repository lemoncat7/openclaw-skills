# Wechat Draft — 微信 API 直发草稿箱

直接调微信 API 发布文章，不依赖第三方工具，自己掌控每一步。

## 安装

需要 Node.js 环境：
```bash
npm install -g @doocs/md-cli  # markdown-it 解析器
npm install -g kuaifa  # sharp 压缩封面用
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
node ~/.openclaw/workspace/skills/wechat-draft/publish.js [--theme elegant] <文章.md> <封面.png> <标题> [摘要]
```

## 主题

| 主题 | 说明 |
|------|------|
| `grace` | 优雅简洁风格（默认） |
| `elegant` | 深蓝科技风，高对比度 |
| `default` | doocs/md 原生样式 |
| `simple` | 简洁风格 |

## 图片效果（支持叠加 `|shadow`）

| 语法 | 效果 |
|------|------|
| `\|border` | 边框 |
| `\|shadow` | 阴影（可叠加） |
| `\|rounded` | 大圆角 |
| `\|phone\|shadow` | 手机边框+阴影 |
| `\|macos\|shadow` | macOS 窗口+阴影 |
| `\|browser\|shadow` | 浏览器窗口+阴影 |
| `\|terminal` | 终端窗口（黑底+路径栏） |
| `\|polaroid` | 拍立得（白底+标签区） |
| `\|film` | 电影胶片（深色+参数栏） |
| `\|caption` | 图片+描述文字 |

## 示例

```markdown
![截图|phone|shadow](img.png)   手机+阴影
![截图|macos|shadow](img.png)   Mac窗口+阴影
![截图|terminal](img.png)      终端窗口
![照片|polaroid](img.jpg)       拍立得
![剧照|film](img.jpg)           电影胶片
```

## 已知坑

- **封面**：必须用 `material/add_material?type=thumb`，不是 `media/upload`
- **封面格式**：JPEG ≤64KB，sharp 自动压缩
- **CSS 变量**：elegant 主题用深色变量
