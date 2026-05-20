# wechat-draft — 微信公众号草稿发布

> 用 Markdown 直接发微信公众号草稿，支持多种图片效果和视频渲染。

## 配置

```json
// ~/.openclaw/conf/wechat-draft/credentials.json
{
  "WECHAT_APP_ID": "wx...",
  "WECHAT_APP_SECRET": "..."
}
```

## 使用

```bash
cd ~/.openclaw/workspace
node skills/wechat-draft/publish.js [--theme grace] <article.md> <cover.png> <title> [digest]
```

## 主题 (--theme)

`grace` (默认) | `elegant` | `default` | `simple`

## 图片效果

在 Markdown 图片 alt 文本中添加 `|` 分隔的效果标记：

```
![alt文本|效果1|效果2](image.jpg)
```

### 基础效果

| 语法 | 说明 |
|------|------|
| `|border` | 边框 |
| `|shadow` | 阴影（可叠加） |
| `|rounded` | 大圆角 |
| `|slim` | 超细边框 |
| `|caption` | 图片描述（斜体文字） |
| `|pin` | Pinterest风格（轻柔阴影） |
| `|minimal` | 底部彩虹渐变线 |

### 设备框

| 语法 | 说明 |
|------|------|
| `|phone` | 手机边框 |
| `|macos` | Mac窗口 |
| `|browser` | 浏览器窗口 |
| `|terminal` | 终端窗口 |
| `|ipad` | iPad边框 |

### 相框风格

| 语法 | 说明 |
|------|------|
| `|polaroid` | 拍立得 |
| `|film` | 电影胶片 |
| `|vintage` | 复古老照片 |
| `|tv` | 复古电视机 |
| `|code` | 代码卡片 |
| `|note` | 便利贴 |
| `|newspaper` | 报纸剪报（SPECIAL REPORT） |
| `|bookpage` | 书页效果 |
| `|ticket` | 电影票 |
| `|blueprint` | 蓝图工程图 |
| `|stamp` | 邮票边框 |
| `|comic` | 漫画对话框（POW!） |
| `|card` | 简洁卡片 |

### 艺术/滤镜

| 语法 | 说明 |
|------|------|
| `|neon` | 霓虹发光边框 |
| `|grayscale` | 黑白灰度 |
| `|watercolor` | 水彩晕染 |
| `|focus` | 聚焦暗角 |

### 科技感

| 语法 | 说明 |
|------|------|
| `|float` | 3D悬浮卡片 |
| `|gradient` | 彩虹渐变光晕 |
| `|glass` | 磨砂玻璃 |
| `|tape` | 胶带贴图 |
| `|adaptive` | 全宽自适应 |

### 布局（连续图片自动并排）

| 语法 | 说明 | 用法 |
|------|------|------|
| `|row` | 任意数量并排 | 连续2-4张 |
| `|gallery2` | 两列并排+圆角 | 连续两张 |
| `|gallery3` | 三列并排+圆角 | 连续三张 |
| `|cascade` | 梯形分层叠放 | 连续三张 |
| `|stack` | 扇形叠放 | 连续三张 |
| `|strip` | 横向条带 | 连续三张 |
| `|featured` | 主图+双缩略图 | 连续三张 |
| `|masonry` | 瀑布流两列 | 连续偶数张 |
| `|compare` | 左右对比（BEFORE/AFTER） | 连续两张 |
| `|auto` | 自动并排 | 连续两张 |

## 视频渲染

在文章中单独一行使用：

```
::video::素材ID|风格::
```

支持的风格：

| 风格 | 说明 |
|------|------|
| `tv` | 复古电视机 |
| `monitor` | 现代显示器 |
| `cinema` | 电影院幕布 |
| `polaroid` | 拍立得 |
| `film` | 电影胶片 |
| `neon` | 霓虹灯 |
| `tablet` | 平板电脑 |
| `gameboy` | 游戏机 |

示例：
```
::video::mxpV0AXNYSZzy0q8ZtsU|tv::
::video::mxpV0AXNYSZzy0q8ZtsU|cinema::
```

## 公众号名片

```
::account::gh_xxxxxxxx::公众号名称::
```

示例：
```
::account::gh_abc123::石臻说AI::
```

发布后在微信中显示公众号关注卡片。

## 效果叠加示例

```markdown
![截图|macos|shadow](screenshot.png)       <!-- Mac窗口+阴影 -->
![照片|film|shadow](photo.jpg)           <!-- 电影胶片+阴影 -->
![banner|gradient|shadow](banner.png)      <!-- 彩虹渐变+阴影 -->
```
