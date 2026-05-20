#!/usr/bin/env node
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
    const hasPolaroid = alt.includes('|polaroid');
    const hasFilm = alt.includes('|film');
    const hasNeon = alt.includes('|neon');
    const hasVintage = alt.includes('|vintage');
    const hasTv = alt.includes('|tv');
    const hasStamp = alt.includes('|stamp');
    const hasCaption = alt.includes('|caption');
    if (hasBorder) alt = alt.replace(/\|border/g, '').trim();
    if (hasShadow) alt = alt.replace(/\|shadow/g, '').trim();
    if (hasRounded) alt = alt.replace(/\|rounded/g, '').trim();
    if (hasPhone) alt = alt.replace(/\|phone/g, '').trim();
    if (hasMacos) alt = alt.replace(/\|macos/g, '').trim();
    if (hasBrowser) alt = alt.replace(/\|browser/g, '').trim();
    if (hasTerminal) alt = alt.replace(/\|terminal/g, '').trim();
    if (hasPolaroid) alt = alt.replace(/\|polaroid/g, '').trim();
    if (hasFilm) alt = alt.replace(/\|film/g, '').trim();
    if (hasNeon) alt = alt.replace(/\|neon/g, '').trim();
    if (hasVintage) alt = alt.replace(/\|vintage/g, '').trim();
    if (hasTv) alt = alt.replace(/\|tv/g, '').trim();
    if (hasStamp) alt = alt.replace(/\|stamp/g, '').trim();
    if (hasCaption) alt = alt.replace(/\|caption/g, '').trim();
    const title = token.attrGet('title') || '';
    const titleAttr = title ? ' title="'+title+'"' : '';


    // stamp 邮票边框
    if (hasStamp) {
      const stampName = alt || 'CHINA MAIL';
      const stampCountry = '中国邮政';
      const stampBg = hasShadow ? '#f5f0e6' : '#f8f4ec';
      return '<div style="display:inline-block;max-width:100%;margin:1.5em auto;padding:0;">' +
        '<div style="background:'+stampBg+';border:2px solid #c8a96e;border-radius:2px;padding:8px;position:relative;">' +
        '<div style="position:absolute;top:8px;left:8px;right:8px;bottom:8px;border:1px dashed #c8a96e;"></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">' +
        '<span style="font-size:10px;color:#8b7355;font-family:Georgia,serif;">&#9679; ' + stampCountry + '</span>' +
        '<span style="font-size:9px;color:#8b7355;font-family:Arial,sans-serif;">' + stampName + ' &#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span>' +
        '</div>' +
        '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;max-width:100%;border-radius:2px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">' +
        '<span style="font-size:9px;color:#8b7355;font-family:Arial,sans-serif;">' + stampName + '</span>' +
        '<span style="font-size:9px;color:#8b7355;font-family:Georgia,serif;">' + stampCountry + '</span>' +
        '</div></div></div>';
      return stampBranch;
    }
        if (hasTv) {
      // 复古电视机
      const tvName = alt || 'CRT TV';
      const tvShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : 'box-shadow:0 4px 16px rgba(0,0,0,0.25)';
      const code = '<div style="display:block;max-width:280px;margin:1.5em auto;">' +
        '<div style="background:#2d2d2d;border-radius:16px 16px 0 0;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;gap:6px;align-items:center;">' +
        '<div style="width:16px;height:16px;border-radius:50%;background:#cc2222;box-shadow:inset 0 -2px 4px rgba(0,0,0,0.3);"></div>' +
        '<div style="width:16px;height:16px;border-radius:50%;background:#1e8f23;box-shadow:inset 0 -2px 4px rgba(0,0,0,0.3);"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
        '<div style="width:20px;height:14px;background:#1a1a1a;border:1px solid #444;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#888;font-family:sans-serif;">|</div>' +
        '<div style="width:20px;height:14px;background:#1a1a1a;border:1px solid #444;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#888;font-family:sans-serif;">·</div>' +
        '</div>' +
        '</div>' +
        '<div style="background:#111;border-radius:0 0 8px 8px;overflow:hidden;border:3px solid #2d2d2d;border-top:none;' + tvShadow + ';">' +
        '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;"></div>' +
        '<div style="padding:4px 8px 0;font-size:10px;color:#666;font-family:sans-serif;display:flex;justify-content:space-between;">' +
        '<span>CRT TV</span><span>'+tvName+'</span></div>' +
        '</div>';
      return code;
    }

    if (hasNeon) {
      // 霓虹发光
      const neonAlt = alt || 'Neon';
      const neonStyle = hasShadow ? 'box-shadow:0 0 15px #0ff,0 0 30px #f0f,0 0 45px #ff0,0 0 60px rgba(0,240,255,0.5)' : 'box-shadow:0 0 8px #0ff,0 0 16px #f0f,0 0 24px #ff0';
      const neonGrad = hasShadow ? '#0ff,#f0f,#ff0,#00ff00' : '#0ff,#f0f,#ff0';
      return '<div style="display:block;max-width:100%;margin:1.5em auto;padding:3px;background:linear-gradient(135deg,#0ff,#f0f,#ff0);border-radius:12px;' + neonStyle + ';">' +
        '<div style="background:#111;padding:4px;border-radius:10px;">' +
        '<img src="'+src+'" alt="'+neonAlt+'"'+titleAttr+' style="display:block;max-width:100%;border-radius:6px;">' +
        '</div>' +
        '<p style="text-align:center;color:#0ff;font-size:11px;margin:6px 0 0;font-family:monospace;letter-spacing:2px;text-shadow:0 0 8px #0ff;">&#x26A1; '+neonAlt+'</p>' +
        '</div>';
    }

    if (hasVintage) {
      // 复古老照片
      const vtAlt = alt || 'Vintage Photo';
      const vtStyle = hasShadow ? 'box-shadow:8px 8px 20px rgba(139,119,101,0.4)' : '';
      return '<div style="display:block;max-width:100%;margin:1em;padding:12px 12px 28px;background:#f5f0e6;border:2px solid #d4c5a9;border-radius:4px;' + vtStyle + '">' +
        '<img src="'+src+'" alt="'+vtAlt+'"'+titleAttr+' style="display:block;width:100%;border-radius:4px;filter:sepia(0.3) contrast(0.95) brightness(0.95);">' +
        '<p style="text-align:center;color:#8b7355;font-size:11px;margin:8px 0 0;font-family:Georgia,serif;font-style:italic;">&#8212; '+vtAlt+' &#8212;</p>' +
        '</div>';
    }

    if (hasPolaroid) {
      // 拍立得
      const photoCaption = alt || 'Photo';
      const polShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.35)' : 'box-shadow:0 4px 16px rgba(0,0,0,0.2)';
      return '<div style="display:inline-block;max-width:100%;margin:1em;padding:10px 10px 28px;background:#fff;border-radius:4px;' + polShadow + '">' +
        '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;border-radius:2px;">' +
        '<p style="text-align:center;color:#666;font-size:12px;margin-top:8px;font-family:-apple-system,sans-serif;">'+photoCaption+'</p>' +
        '</div>';
    }

    if (hasFilm) {
      // 电影胶片
      const filmTitle = alt || 'Film';
      const filmShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.5)' : 'box-shadow:0 6px 24px rgba(0,0,0,0.3)';
      const filmUrl = 'https://oss.example.com/film';
      return '<div style="display:block;max-width:100%;margin:1.2em auto;padding:6px 6px 6px;border-radius:4px;background:#1a1a1a;' + filmShadow + '">' +
        '<div style="background:#000;padding:4px;border-radius:2px;">' +
        '<img src="'+src+'" alt="'+filmTitle+'"'+titleAttr+' style="display:block;width:100%;border-radius:2px;filter:contrast(1.1) brightness(0.92) sepia(0.15);">' +
        '</div>' +
        '<p style="color:#aaa;font-size:11px;text-align:center;margin:6px 0 0;font-family:monospace;letter-spacing:2px;">'+filmTitle+'</p>' +
        '<div style="display:flex;justify-content:space-between;margin-top:4px;">' +
        '<span style="color:#666;font-size:9px;font-family:monospace;">2026 &middot; FILM</span>' +
        '<span style="color:#666;font-size:9px;font-family:monospace;">MINIMAX &middot; 50mm F1.8 ISO400</span>' +
        '</div></div>';
    }

    if (hasTerminal) {
      // 终端窗口
      const termPath = alt || '~/code/project';
      const termShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : '';
      return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;' + termShadow + ';border:1px solid #2d2d2d;background:#1e1e1e">' +
        '<div style="background:#323232;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2d2d2d">' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block;"></span>' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span>' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#28c840;display:inline-block;"></span>' +
        '<span style="flex:1"></span>' +
        '<span style="background:#1e1e1e;border:1px solid #4a4a4a;border-radius:4px;padding:3px 10px;color:#ccc;font-size:11px;font-family:Menlo,Monaco,monospace;">root@localhost:'+termPath+'</span>' +
        '<span style="width:8px"></span>' +
        '</div><img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;"></div>';
    }

    if (hasMacos) {
      // macOS 窗口
      const macTitle = alt || 'Screenshot';
      const macShadow = hasShadow ? 'box-shadow:0 12px 40px rgba(0,0,0,0.5)' : 'box-shadow:0 8px 30px rgba(0,0,0,0.3)';
      return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:10px;overflow:hidden;' + macShadow + ';border:1px solid #2d2d2d;background:#1e1e1e">' +
        '<div style="background:#2d2d2d;padding:10px 14px;display:flex;align-items:center;gap:8px">' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;"></span>' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;"></span>' +
        '<span style="width:12px;height:12px;border-radius:50%;background:#28c840;"></span>' +
        '<span style="flex:1;text-align:center;color:#999;font-size:12px;font-family:-apple-system,sans-serif;">'+macTitle+'</span>' +
        '</div><img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;"></div>';
    }

    if (hasBrowser) {
      // 浏览器窗口
      const browserUrl = alt || 'https://example.com';
      const browserShadow = hasShadow ? 'box-shadow:0 10px 36px rgba(0,0,0,0.35)' : 'box-shadow:0 6px 24px rgba(0,0,0,0.25)';
      return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;' + browserShadow + ';border:1px solid #d1d5db;background:#fff">' +
        '<div style="background:#f3f4f6;padding:8px 12px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #d1d5db">' +
        '<span style="font-size:14px;">&#128274;</span>' +
        '<span style="flex:1;color:#6b7280;font-size:12px;font-family:-apple-system,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+browserUrl+'</span>' +
        '</div><img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;"></div>';
    }

    if (hasPhone) {
      // 手机边框
      const phoneShadow = hasShadow ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : 'box-shadow:0 4px 20px rgba(0,0,0,0.3)';
      return '<div style="display:block;max-width:320px;margin:1.2em auto;padding:8px 8px 12px;background:#1e293b;border-radius:24px;' + phoneShadow + '">' +
        '<div style="width:60px;height:4px;background:#334155;border-radius:4px;margin:0 auto 8px"></div>' +
        '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;width:100%;border-radius:16px;"></div>';
    }

    // caption 图片描述
    if (hasCaption) {
      const captionText = alt;
      return '<figure style="margin:1.2em auto;text-align:center;">' +
        '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="display:block;max-width:100%;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">' +
        '<figcaption style="text-align:center;color:#94a3b8;font-size:13px;margin-top:0.5em;font-style:italic;">'+captionText+'</figcaption></figure>';
    }

    // 普通图片
    let style = 'display:block;max-width:100%;margin:1.2em auto;border-radius:8px;';
    if (hasBorder) style += 'border:2px solid #334155;';
    if (hasShadow) style += 'box-shadow:0 4px 20px rgba(0,0,0,0.4);';
    return '<img src="'+src+'" alt="'+alt+'"'+titleAttr+' style="'+style+'">';
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
    const re = new RegExp('<'+tag+'([^>]*?)(style="[^"]*")?([^>]*?)>', 'gi');
    result = result.replace(re, (match, before, existingStyle, after) => {
      if (existingStyle) return match;
      return '<'+tag+before+' style="'+combinedProps+'"'+after+'>';
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
  console.log('4. Markdown -> HTML (theme: ' + theme + ')...');
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
    console.log('主题: grace, elegant, default, simple');
    console.log('效果: border shadow rounded phone macos browser terminal polaroid film neon vintage tv caption');
    process.exit(1);
  }
  publishDraft({ mdPath, coverPath, title, digest: digest || '', theme })
    .then(r => { if (!r.media_id) process.exit(1); })
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { publishDraft };
