#!/usr/bin/env node
/**
 * Wechat Draft Publisher v2
 * 直接调微信 API，不依赖第三方工具
 * CSS 样式来自 doocs/md 主题 (base.css + default.css)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(process.env.HOME, '.openclaw/conf/wechat-draft/credentials.json'), 'utf8')
);
const APPID = CONFIG.WECHAT_APP_ID;
const APPSECRET = CONFIG.WECHAT_APP_SECRET;
const SKILL_DIR = path.join(process.env.HOME, '.openclaw/workspace/skills/wechat-draft');
// ==========================

/**
 * Markdown → HTML（简化版，配合 doocs/md CSS）
 */
function markdownToHtml(md) {
  const markdownit = require('/usr/local/lib/node_modules/md2wechat/node_modules/markdown-it')();
  
  // 代码高亮
  let hljs;
  try {
    hljs = require('/usr/local/lib/node_modules/md2wechat/node_modules/highlight.js/lib/core');
    // 简单注册几个常用语言
    ['bash', 'javascript', 'typescript', 'python', 'json', 'css', 'html', 'xml', 'sql', 'go', 'rust', 'java'].forEach(lang => {
      try { hljs.registerLanguage(lang, require(`/usr/local/lib/node_modules/md2wechat/node_modules/highlight.js/lib/languages/${lang}`)); } catch(e) {}
    });
  } catch(e) {}

  markdownit.set({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      const language = lang || 'bash';
      let highlighted = str;
      if (hljs && hljs.getLanguage(language)) {
        try { highlighted = hljs.highlight(str, { language }).value.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'); } catch(e) {}
      }
      return `<pre class="hljs code__pre"><span class="mac-sign" style="padding:10px 14px 0;display:block;"><svg xmlns="http://www.w3.org/2000/svg" width="45" height="13"><ellipse cx="50" cy="65" rx="50" ry="52" fill="#dc3c36"/><ellipse cx="225" cy="65" rx="50" ry="52" fill="#da9721"/><ellipse cx="400" cy="65" rx="50" ry="52" fill="#1ba137"/></svg></span><code class="language-${language}">${highlighted}</code></pre>`;
    }
  });

  return markdownit.render(md);
}

/**
 * 应用 doocs/md CSS（简化 inlining）
 * 策略：CSS 变量替换 + 关键标签 style 内联
 */
function applyCss(html) {
  // 读取 CSS 文件
  const baseCss = fs.readFileSync(path.join(SKILL_DIR, 'base.css'), 'utf8');
  const themeCss = fs.readFileSync(path.join(SKILL_DIR, 'default.css'), 'utf8');

  // CSS 变量默认值
  const cssVars = {
    '--md-primary-color': '#1e6bb8',
    '--md-font-family': 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Georgia, Times, "Times New Roman", serif',
    '--md-font-size': '16px',
    '--foreground': '0, 0, 0',
    '--blockquote-background': 'rgba(0,0,0,0.05)',
  };

  // 替换 var()
  let css = (baseCss + '\n' + themeCss)
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
    .replace(/var\(--([\w-]+)\)/g, (_, name) => cssVars[`--${name}`] || 'inherit');

  // 包装容器
  let result = `<section style="font-family:var(--md-font-family);font-size:var(--md-font-size);line-height:1.75;text-align:left;">${html}</section>`;

  // 基础标签样式内联（从 CSS 提取关键规则）
  const rules = [
    { tag: 'p', selector: 'p', style: 'margin:1.5em 8px;letter-spacing:0.1em;' },
    { tag: 'h1', selector: 'h1', style: 'display:table;padding:0 1em;border-bottom:2px solid var(--md-primary-color);margin:2em auto 1em;font-size:1.2em;font-weight:bold;text-align:center;' },
    { tag: 'h2', selector: 'h2', style: 'display:table;padding:0 0.2em;margin:4em auto 2em;background:var(--md-primary-color);color:#fff;font-size:1.2em;font-weight:bold;text-align:center;' },
    { tag: 'h3', selector: 'h3', style: 'padding-left:8px;border-left:3px solid var(--md-primary-color);margin:2em 8px 0.75em;font-size:1.1em;font-weight:bold;' },
    { tag: 'blockquote', selector: 'blockquote', style: 'padding:1em;border-left:4px solid var(--md-primary-color);border-radius:6px;background:var(--blockquote-background);margin-bottom:1em;' },
    { tag: 'code', selector: 'code', style: 'font-size:90%;color:#d14;background:rgba(27,31,35,0.05);padding:3px 5px;border-radius:4px;' },
    { tag: 'pre', selector: 'pre', style: 'font-size:90%;overflow-x:auto;border-radius:8px;margin:10px 8px;' },
    { tag: 'a', selector: 'a', style: 'color:#576b95;text-decoration:none;' },
    { tag: 'strong', selector: 'strong', style: 'color:var(--md-primary-color);font-weight:bold;' },
    { tag: 'hr', selector: 'hr', style: 'border-style:solid;border-width:2px 0 0;border-color:rgba(0,0,0,0.1);height:0.4em;margin:1.5em 0;transform:scale(1,0.5);transform-origin:0 0;' },
    { tag: 'ul', selector: 'ul', style: 'list-style:circle;padding-left:1em;margin-left:0;' },
    { tag: 'ol', selector: 'ol', style: 'padding-left:1em;margin-left:0;' },
    { tag: 'li', selector: 'li', style: 'display:block;margin:0.2em 8px;' },
    { tag: 'img', selector: 'img', style: 'display:block;max-width:100%;margin:0.1em auto 0.5em;border-radius:4px;' },
    { tag: 'table', selector: 'table', style: 'width:100%;border-collapse:collapse;' },
    { tag: 'th', selector: 'th', style: 'border:1px solid #dfdfdf;padding:0.25em 0.5em;font-weight:bold;background:rgba(0,0,0,0.05);' },
    { tag: 'td', selector: 'td', style: 'border:1px solid #dfdfdf;padding:0.25em 0.5em;' },
  ];

  for (const r of rules) {
    const regex = new RegExp(`<${r.tag}([^>]*)>([\\s\\S]*?)<\\/${r.tag}>`, 'gi');
    result = result.replace(regex, (match, attrs, content) => {
      // 如果已有 style 属性则跳过
      if (attrs.includes('style=')) return match;
      return `<${r.tag}${attrs} style="${r.style}">${content}</${r.tag}>`;
    });
  }

  // 清理不安全的 style 属性
  result = result.replace(/style="[^"]*expression[^"]*"/gi, '');
  result = result.replace(/style="[^"]*javascript:[^"]*"/gi, '');

  return result;
}

/**
 * 主流程
 */
async function publishDraft({ title, author, digest, coverPath, mdPath }) {
  console.log('1. 获取 access_token...');
  const token = JSON.parse(
    execSync(`curl -s "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}"`)
  ).access_token;

  // 2. 压缩封面
  console.log('2. 压缩封面...');
  const sharp = require('/usr/local/lib/node_modules/kuaifa/node_modules/sharp');
  const thumbPath = '/tmp/wechat-thumb.jpg';
  await sharp(coverPath).resize(300, 300, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(thumbPath);
  console.log(`   封面: ${(fs.statSync(thumbPath).size / 1024).toFixed(1)}KB`);

  // 3. 上传封面
  console.log('3. 上传封面...');
  const thumbRes = execSync(
    `curl -s -F media=@${thumbPath} "https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=thumb"`
  );
  const thumbData = JSON.parse(thumbRes);
  if (!thumbData.media_id) {
    console.error('封面上传失败:', thumbData);
    return { errcode: -1, errmsg: JSON.stringify(thumbData) };
  }
  console.log(`   thumb_media_id: ${thumbData.media_id}`);

  // 4. Markdown → HTML → CSS
  console.log('4. Markdown → HTML (doocs/md CSS)...');
  const md = fs.readFileSync(mdPath, 'utf8');
  const rawHtml = markdownToHtml(md);
  const content = applyCss(rawHtml);
  console.log(`   HTML 长度: ${content.length}`);

  // 5. 创建草稿
  console.log('5. 创建草稿...');
  const payload = {
    articles: [{
      title,
      thumb_media_id: thumbData.media_id,
      author: author || '莫殇',
      digest: digest || '',
      content,
      show_cover_pic: 1,
      need_open_comment: 1,
      only_fans_can_comment: 0
    }]
  };

  const postData = JSON.stringify(payload).replace(/'/g, "\\u0027");
  const draftRes = execSync(
    `curl -s -X POST -H "Content-Type: application/json" -d '${postData}' "https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}"`
  );
  const result = JSON.parse(draftRes);

  if (result.media_id) {
    console.log(`✅ 草稿创建成功! media_id: ${result.media_id}`);
  } else {
    console.error('❌ 失败:', result);
  }
  return result;
}

// ========== CLI ==========
if (require.main === module) {
  const args = process.argv.slice(2);
  const [mdPath, coverPath, title, digest] = args;

  if (!mdPath || !coverPath || !title) {
    console.log('用法: node publish.js <article.md> <cover.png> <title> [digest]');
    process.exit(1);
  }

  publishDraft({ mdPath, coverPath, title, digest: digest || '' })
    .then(r => { if (!r.media_id) process.exit(1); })
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { publishDraft };