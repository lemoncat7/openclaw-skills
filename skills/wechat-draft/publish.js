#!/usr/bin/env node
/**
 * Wechat Draft Publisher
 * 8 种图片效果：|border |shadow |rounded |phone |macos |browser |terminal |caption
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(process.env.HOME, '.openclaw/conf/wechat-draft/credentials.json'), 'utf8')
);
const APPID = CONFIG.WECHAT_APP_ID;
const APPSECRET = CONFIG.WECHAT_APP_SECRET;
const SKILL_DIR = path.join(process.env.HOME, '.openclaw/workspace/skills/wechat-draft');

function markdownToHtml(md) {
  const markdownit = require('/usr/local/lib/node_modules/md2wechat/node_modules/markdown-it')();
  let hljs;
  try {
    hljs = require('/usr/local/lib/node_modules/md2wechat/node_modules/highlight.js/lib/core');
    ['bash','javascript','typescript','python','json','css','html','xml','sql','go','rust','java'].forEach(lang => {
      try { hljs.registerLanguage(lang, require('/usr/local/lib/node_modules/md2wechat/node_modules/highlight.js/lib/languages/'+lang)); } catch(e){}
    });
  } catch(e){}

  markdownit.set({
    html: true, linkify: true, typographer: true,
    highlight: (str, lang) => {
      const language = lang || 'bash';
      let highlighted = str;
      if (hljs && hljs.getLanguage(language)) {
        try { highlighted = hljs.highlight(str, { language }).value.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'); } catch(e){}
      }
      return `<pre class="hljs code__pre"><span class="mac-sign" style="padding:10px 14px 0;display:block;"><svg xmlns="http://www.w3.org/2000/svg" width="45" height="13"><ellipse cx="50" cy="65" rx="50" ry="52" fill="#dc3c36"/><ellipse cx="225" cy="65" rx="50" ry="52" fill="#da9721"/><ellipse cx="400" cy="65" rx="50" ry="52" fill="#1ba137"/></svg></span><code class="language-${language}">${highlighted}</code></pre>`;
    }
  });

  // 8 种图片效果
  const defaultImage = markdownit.renderer.rules.image || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  markdownit.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const src = token.attrGet('src') || '';
    let alt = token.content || '';
    const hasBorder = alt.includes('|border');
    const hasShadow = alt.includes('|shadow');
    const hasRounded = alt.includes('|rounded');
    const hasPhone = alt.includes('|phone');
    const hasMacos = alt.includes('|macos');
    const hasBrowser = alt.includes('|browser');
    const hasTerminal = alt.includes('|terminal');
    const hasCaption = alt.includes('|caption');

    if (hasBorder) alt = alt.replace(/\|border/g, '').trim();
    if (hasShadow) alt = alt.replace(/\|shadow/g, '').trim();
    if (hasRounded) alt = alt.replace(/\|rounded/g, '').trim();
    if (hasPhone) alt = alt.replace(/\|phone/g, '').trim();
    if (hasMacos) alt = alt.replace(/\|macos/g, '').trim();
    if (hasBrowser) alt = alt.replace(/\|browser/g, '').trim();
    if (hasTerminal) alt = alt.replace(/\|terminal/g, '').trim();
    if (hasCaption) alt = alt.replace(/\|caption/g, '').trim();
    const title = token.attrGet('title') || '';
    const titleAttr = title ? ` title="${title}"` : '';
    const extraShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4);' : '';

    // terminal 终端窗口
    if (hasTerminal) {
      const termPath = alt || '~/code/project';
      const termUser = 'root';
      const termHost = 'localhost';
      return `<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;${extraShadow}border:1px solid #2d2d2d;background:#1e1e1e;"><div style="background:#323232;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2d2d2d;"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block;"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span><span style="width:12px;height:12px;border-radius:50%;background:#28c940;display:inline-block;"></span><span style="flex:1;"></span><span style="background:#1e1e1e;border:1px solid #4a4a4a;border-radius:4px;padding:3px 10px;color:#ccc;font-size:11px;font-family:Menlo,Monaco,monospace;">${termUser}@${termHost}:${termPath}</span><span style="width:8px;"></span></div><img src="${src}" alt="${alt}"${titleAttr} style="display:block;width:100%;"/></div>`;
    }

    // phone 手机边框
    if (hasPhone) {
      const phoneShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4);' : 'box-shadow:0 4px 20px rgba(0,0,0,0.3);';
      return `<div style="display:block;max-width:320px;margin:1.2em auto;padding:8px 8px 12px;background:#1e293b;border-radius:24px;${phoneShadow}"><div style="width:60px;height:4px;background:#334155;border-radius:4px;margin:0 auto 8px;"></div><img src="${src}" alt="${alt}"${titleAttr} style="display:block;width:100%;border-radius:16px;"></div>`;
    }

    // macOS 窗口
    if (hasMacos) {
      const macTitle = alt || 'Screenshot';
      const macShadow = hasShadow ? '0 12px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.3)';
      return `<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:10px;overflow:hidden;box-shadow:${macShadow};border:1px solid #2d2d2d;background:#1e1e1e;"><div style="background:#2d2d2d;padding:10px 14px;display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block;"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span><span style="width:12px;height:12px;border-radius:50%;background:#28c940;display:inline-block;"></span><span style="flex:1;text-align:center;color:#999;font-size:12px;font-family:-apple-system,sans-serif;">${macTitle}</span></div><img src="${src}" alt="${alt}"${titleAttr} style="display:block;width:100%;"></div>`;
    }

    // browser 浏览器窗口
    if (hasBrowser) {
      const browserUrl = alt || 'https://example.com';
      const browserShadow = hasShadow ? '0 10px 36px rgba(0,0,0,0.35)' : '0 6px 24px rgba(0,0,0,0.25)';
      return `<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;box-shadow:${browserShadow};border:1px solid #d1d5db;background:#fff;"><div style="background:#f3f4f6;padding:8px 12px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #d1d5db;"><span style="font-size:14px;">🔒</span><span style="flex:1;color:#6b7280;font-size:12px;font-family:-apple-system,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${browserUrl}</span></div><img src="${src}" alt="${alt}"${titleAttr} style="display:block;width:100%;"></div>`;
    }

    // 普通效果
    let style = 'display:block;max-width:100%;margin:1.2em auto;';
    if (hasRounded) style += 'border-radius:50%;';
    else style += 'border-radius:8px;';
    if (hasBorder) style += 'border:2px solid var(--el-border);';
    if (hasShadow) style += 'box-shadow:0 4px 20px rgba(0,0,0,0.4);';
    if (hasCaption) {
      const captionText = alt || '';
      return `<figure style="margin:1.2em auto;"><img src="${src}" alt="${alt}"${titleAttr} style="${style}"></figure><figcaption style="text-align:center;color:var(--el-muted);font-size:80%;margin-top:0.4em;font-style:italic;">${captionText}</figcaption>`;
    }
    return `<img src="${src}" alt="${alt}"${titleAttr} style="${style}">`;
  };

  return markdownit.render(md);
}

function resolveCssVars(css, vars) {
  let result = css;
  for (let i = 0; i < 10; i++) {
    const prev = result;
    result = result.replace(/var\(--([\w-]+)(?:,\s*([^)]*))?\)/g, (_, name, fallback) => {
      return vars['--' + name] || fallback || 'inherit';
    });
    if (result === prev) break;
  }
  return result;
}

function applyCss(html, theme) {
  const baseCss = fs.readFileSync(path.join(SKILL_DIR, 'base.css'), 'utf8');
  const themeCss = fs.readFileSync(path.join(SKILL_DIR, theme + '.css'), 'utf8');
  const vars = {
    '--md-primary-color': '#1a56db',
    '--md-font-family': 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Georgia, Times, "Times New Roman", serif',
    '--md-font-size': '16px',
    '--foreground': '0, 0, 0',
    '--blockquote-background': 'rgba(0,0,0,0.05)',
    '--el-primary': '#1a56db', '--el-bg': '#0f172a', '--el-surface': '#1e293b',
    '--el-border': '#334155', '--el-text': '#e2e8f0', '--el-muted': '#94a3b8',
    '--el-accent': '#3b82f6', '--el-green': '#10b981', '--el-red': '#ef4444',
    '--el-yellow': '#f59e0b', '--el-purple': '#8b5cf6',
  };
  let css = resolveCssVars(baseCss + '\n' + themeCss, vars);
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectorMap = {};
  const ruleRe = /([^{]+)\{([^}]+)\}/g;
  let m;
  while ((m = ruleRe.exec(css)) !== null) {
    const sel = m[1].trim();
    const props = m[2].trim();
    if (!selectorMap[sel]) selectorMap[sel] = [];
    selectorMap[sel].push(props);
  }
  let result = html;
  const tags = ['p','h1','h2','h3','h4','h5','h6','blockquote','code','pre','a','strong','em','hr','ul','ol','li','img','table','th','td','figure','figcaption','section'];
  for (const tag of tags) {
    if (!selectorMap[tag]) continue;
    const combinedProps = selectorMap[tag].join(' ');
    if (!combinedProps) continue;
    const re = new RegExp(`<${tag}([^>]*?)(style="[^"]*")?([^>]*?)>`, 'gi');
    result = result.replace(re, (match, before, existingStyle, after) => {
      if (existingStyle) return match;
      return `<${tag}${before} style="${combinedProps}"${after}>`;
    });
  }
  return result;
}

async function publishDraft({ title, author, digest, coverPath, mdPath, theme }) {
  console.log('[' + theme + '] 1. 获取 access_token...');
  const token = JSON.parse(
    execSync('curl -s "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET + '"')
  ).access_token;
  console.log('2. 压缩封面...');
  const sharp = require('/usr/local/lib/node_modules/kuaifa/node_modules/sharp');
  const thumbPath = '/tmp/wechat-thumb.jpg';
  await sharp(coverPath).resize(300, 300, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(thumbPath);
  console.log('   封面: ' + (fs.statSync(thumbPath).size / 1024).toFixed(1) + 'KB');
  console.log('3. 上传封面...');
  const thumbRes = execSync('curl -s -F media=@' + thumbPath + ' "https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=' + token + '&type=thumb"');
  const thumbData = JSON.parse(thumbRes);
  if (!thumbData.media_id) {
    console.error('封面上传失败:', thumbData);
    return { errcode: -1, errmsg: JSON.stringify(thumbData) };
  }
  console.log('   thumb_media_id: ' + thumbData.media_id);
  console.log('4. Markdown -> HTML...');
  const md = fs.readFileSync(mdPath, 'utf8');
  const rawHtml = markdownToHtml(md);
  const content = applyCss(rawHtml, theme);
  console.log('   HTML 长度: ' + content.length);
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
  const draftRes = execSync('curl -s -X POST -H "Content-Type: application/json" -d \'' + postData + '\' "https://api.weixin.qq.com/cgi-bin/draft/add?access_token=' + token + '"');
  const result = JSON.parse(draftRes);
  if (result.media_id) {
    console.log('✅ 草稿创建成功! media_id: ' + result.media_id);
  } else {
    console.error('❌ 失败:', result);
  }
  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let mdPath, coverPath, title, digest, theme = 'grace';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--theme' && args[i+1]) { theme = args[i+1]; i++; }
    else if (!mdPath) mdPath = args[i];
    else if (!coverPath) coverPath = args[i];
    else if (!title) title = args[i];
    else if (!digest) digest = args[i];
  }
  if (!mdPath || !coverPath || !title) {
    console.log('用法: node publish.js [--theme elegant] <article.md> <cover.png> <title> [digest]');
    console.log('主题: default, grace, simple, elegant');
    console.log('效果: |border |shadow |rounded |phone |macos |browser |terminal |caption');
    process.exit(1);
  }
  publishDraft({ mdPath, coverPath, title, digest: digest || '', theme })
    .then(r => { if (!r.media_id) process.exit(1); })
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { publishDraft };
