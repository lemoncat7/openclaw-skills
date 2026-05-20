#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.openclaw/conf/wechat-draft/credentials.json'), 'utf8'));
const APPID = CONFIG.WECHAT_APP_ID;
const APPSECRET = CONFIG.WECHAT_APP_SECRET;
const SKILL_DIR = path.join(process.env.HOME, '.openclaw/workspace/skills/wechat-draft');

function md2html(md) {
  const mdit = require('/usr/local/lib/node_modules/md2wechat/node_modules/markdown-it')();
  mdit.set({ html: true, linkify: true, typographer: true });
  mdit.renderer.rules.image = imgRule;
  return mdit.render(md);
}

function imgRule(tokens, idx) {
  const t = tokens[idx];
  const src = t.attrGet('src') || '';
  let alt = t.content || '';
  const B = alt.includes('|border');
  const S = alt.includes('|shadow');
  const R = alt.includes('|rounded');
  const P = alt.includes('|phone');
  const M = alt.includes('|macos');
  const W = alt.includes('|browser');
  const L = alt.includes('|terminal');
  const O = alt.includes('|polaroid');
  const F = alt.includes('|film');
  const Ne = alt.includes('|neon');
  const V = alt.includes('|vintage');
  const TV = alt.includes('|tv');
  const C = alt.includes('|code');
  const Nt = alt.includes('|note');
  const I = alt.includes('|ipad');
  const Np = alt.includes('|newspaper');
  const G = alt.includes('|grayscale');
  const Gl = alt.includes('|glass');
  const Tp = alt.includes('|tape');
  const Bk = alt.includes('|bookpage');
  const Cm = alt.includes('|comic');
  const Tk = alt.includes('|ticket');
  const Bl = alt.includes('|blueprint');
  const Cd = alt.includes('|card');
  const Wc = alt.includes('|watercolor');
  const Pn = alt.includes('|pin');
  const Sl = alt.includes('|slim');
  const Dl = alt.includes('|dual');
  const Fs = alt.includes('|focus');
  const Fl = alt.includes('|float');
  const Gr = alt.includes('|gradient');
  const Cp = alt.includes('|caption');
  alt = alt.replace(/\|border/g,'').replace(/\|shadow/g,'').replace(/\|rounded/g,'')
          .replace(/\|phone/g,'').replace(/\|macos/g,'').replace(/\|browser/g,'')
          .replace(/\|terminal/g,'').replace(/\|polaroid/g,'').replace(/\|film/g,'')
          .replace(/\|neon/g,'').replace(/\|vintage/g,'').replace(/\|tv/g,'')
          .replace(/\|code/g,'').replace(/\|note/g,'').replace(/\|ipad/g,'')
          .replace(/\|newspaper/g,'').replace(/\|grayscale/g,'').replace(/\|float/g,'')
          .replace(/\|gradient/g,'').replace(/\|glass/g,'').replace(/\|tape/g,'').replace(/\|bookpage/g,'').replace(/\|comic/g,'').replace(/\|ticket/g,'').replace(/\|caption/g,'').replace(/\|slim/g,'').replace(/\|pin/g,'').replace(/\|focus/g,'').replace(/\|dual/g,'').trim();
  const title = t.attrGet('title') || '';
  const ta = title ? ' title="' + title + '"' : '';

  if (Tp) {
    const tpAlt = alt || 'Diary';
    const tpPad = S ? 'padding:12px 14px 24px' : 'padding:8px 10px 18px';
    const tpSd = S ? 'box-shadow:3px 5px 15px rgba(0,0,0,0.2)' : 'box-shadow:2px 3px 8px rgba(0,0,0,0.12)';
    const tapes = [
      {color:'rgba(255,230,120,0.75)', w:48, top:'-6px', left:'30%', rot:'-4deg'},
      {color:'rgba(180,200,255,0.65)', w:40, top:'-6px', left:'58%', rot:'3deg'},
    ];
    const tapeHtml = tapes.map(t => '<div style="position:absolute;top:'+t.top+';left:'+t.left+';width:'+t.w+'px;height:18px;background:'+t.color+';transform:rotate('+t.rot+');box-shadow:0 1px 2px rgba(0,0,0,0.15)"></div>').join('');
    return '<div style="display:block;max-width:100%;margin:1.5em auto;position:relative;' + tpSd + '">' +
           tapeHtml +
           '<div style="background:#fffef5;padding:'+tpPad+';border-radius:2px;border:1px solid rgba(0,0,0,0.06)">' +
           '<img src="'+src+'" alt="'+tpAlt+'"'+ta+' style="display:block;width:100%;border-radius:3px;filter:contrast(1.03) brightness(1.02)"></div></div>';
  }

  if (Bk) {
    const bkAlt = alt || 'Reading Note';
    const bkSd = S ? 'box-shadow:4px 4px 20px rgba(0,0,0,0.25)' : 'box-shadow:2px 2px 10px rgba(0,0,0,0.15)';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;padding:0 24px 20px;background:#faf7f2;border-radius:2px;position:relative;' + bkSd + '">' +
           '<div style="position:absolute;top:0;bottom:0;left:20px;width:2px;background:linear-gradient(to bottom,#e8d5b0,#d4c095,#e8d5b0)"></div>' +
           '<div style="margin-left:14px;padding:14px 0 0">' +
           '<p style="font-family:Baskerville,Georgia,serif;font-size:13px;line-height:2;color:#4a3728;margin:0 0 6px;border-bottom:1px solid rgba(139,90,43,0.2);padding-bottom:6px">&#x1F4D6; ' + bkAlt + '</p>' +
           '<img src="'+src+'" alt="'+bkAlt+'"'+ta+' style="display:block;width:100%;border-radius:2px;filter:sepia(0.08) contrast(1.05)"></div></div>';
  }



  // watercolor 水彩晕染
  if (Wc) {
    const wcAlt = alt || 'Watercolor';
    const wcSd = S ? 'box-shadow:0 8px 32px rgba(0,0,0,0.2)' : '';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;padding:16px;background:#fff;border-radius:4px;position:relative;overflow:hidden;' + wcSd + '">' +
           '<div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;background:radial-gradient(circle,rgba(168,212,244,0.4),transparent 70%);border-radius:50%;pointer-events:none"></div>' +
           '<div style="position:absolute;bottom:-15px;left:-15px;width:100px;height:100px;background:radial-gradient(circle,rgba(244,212,168,0.35),transparent 70%);border-radius:50%;pointer-events:none"></div>' +
           '<img src="'+src+'" alt="'+wcAlt+'"'+ta+' style="display:block;width:100%;border-radius:4px;filter:contrast(0.95) brightness(1.02) saturate(0.9);position:relative;z-index:1"></div>';
  }

  // card 简洁卡片
  if (Cd) {
    const cdTxt = alt || 'TECH CARD';
    const cdSd = S ? 'box-shadow:0 6px 24px rgba(0,0,0,0.3)' : '';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;background:#1e1e2e;border:1px solid #333;border-radius:12px;overflow:hidden;' + cdSd + '">' +
           '<div style="background:#2a2a3e;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333">' +
           '<span style="font-size:12px;color:#888">&#x25CF; &#x25CF; &#x25CF;</span>' +
           '<span style="font-size:11px;color:#666;font-family:monospace">DWG-001 &middot; 2026.05</span></div>' +
           '<img src="'+src+'" alt="'+cdTxt+'"'+ta+' style="display:block;width:100%"></div>';
  }

  if (Bl) {
    const blTxt = alt || 'ARCHITECTURAL DRAWING';
    const blSd = S ? 'box-shadow:4px 4px 20px rgba(0,0,0,0.4)' : '';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;background:#1a3a5c;padding:20px;border:2px solid #4a90d9;border-radius:4px;' + blSd + '">' +
           '<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #4a90d9;padding-bottom:8px;margin-bottom:12px">' +
           '<span style="font-family:monospace;font-size:11px;color:#7eb8e8;letter-spacing:1px">SCALE 1:1</span>' +
           '<span style="font-family:monospace;font-size:14px;font-weight:bold;color:#fff;letter-spacing:2px">&#x25CB; REV.A</span>' +
           '<span style="font-family:monospace;font-size:11px;color:#7eb8e8;letter-spacing:1px">DWG: 001</span></div>' +
           '<div style="position:relative;background:#0f2a45;border:1px solid #2a5a8a;border-radius:2px">' +
           '<div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 19px,#1a3a5c 19px,#1a3a5c 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,#1a3a5c 19px,#1a3a5c 20px);opacity:0.6;pointer-events:none"></div>' +
           '<img src="'+src+'" alt="'+blTxt+'"'+ta+' style="display:block;width:100%;border-radius:2px;opacity:0.9"></div>' +
           '<div style="display:flex;justify-content:space-between;margin-top:10px">' +
           '<span style="font-family:monospace;font-size:10px;color:#7eb8e8">' + blTxt + '</span>' +
           '<span style="font-family:monospace;font-size:10px;color:#7eb8e8">UNIT: mm</span></div></div>';
  }


  if (Tk) {
    const tkTxt = alt || 'MOVIE TICKET';
    const tkSd = S ? 'box-shadow:4px 4px 16px rgba(0,0,0,0.3)' : 'box-shadow:2px 2px 8px rgba(0,0,0,0.2)';
    return '<div style="display:block;max-width:320px;margin:1.5em auto;background:#f5e6c8;border:2px dashed #8b7355;border-radius:4px;position:relative;overflow:hidden;' + tkSd + '">' +
           '<div style="display:flex;align-items:stretch">' +
           '<div style="flex:1;padding:12px 14px">' +
           '<div style="font-family:sans-serif;font-size:10px;color:#8b7355;letter-spacing:1px;margin-bottom:4px">ADMIT ONE</div>' +
           '<div style="font-family:sans-serif;font-size:17px;font-weight:bold;color:#333;line-height:1.1;margin-bottom:8px">' + tkTxt + '</div>' +
           '<div style="font-family:monospace;font-size:10px;color:#666">DATE: 2026.05.20<br/>SEAT: VIP</div></div>' +
           '<div style="width:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:2px dashed #8b7355;padding:8px 4px">' +
           '<div style="width:8px;height:8px;background:#8b7355;border-radius:50%;margin-bottom:4px"></div>' +
           '<div style="width:2px;height:100%;background:repeating-linear-gradient(to bottom,#f5e6c8 0px,#f5e6c8 4px,#8b7355 4px,#8b7355 8px)"></div>' +
           '<div style="width:8px;height:8px;background:#8b7355;border-radius:50%;margin-top:4px"></div></div>' +
           '<div style="flex:1;padding:12px 14px;text-align:center">' +
           '<div style="font-size:20px;color:#c0392b">&hearts;</div>' +
           '<div style="font-family:monospace;font-size:10px;color:#8b7355;margin-top:4px">NO.2026052001</div></div></div></div>';
  }

  if (Cm) {
    const cmTxt = alt || 'POW!';
    const cmSd = S ? 'box-shadow:6px 6px 0 #1a1a1a' : '';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;position:relative">' +
           '<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#ffe500;border:3px solid #1a1a1a;padding:2px 12px;font-family:Bangers,Impact, fantasy;font-size:22px;font-weight:bold;color:#1a1a1a;text-align:center;z-index:2;box-shadow:3px 3px 0 #1a1a1a;line-height:1.2">' + cmTxt + '</div>' +
           '<div style="background:#fff;border:4px solid #1a1a1a;border-radius:4px;margin-top:20px;padding:20px;' + cmSd + '">' +
           '<img src="'+src+'" alt="'+cmTxt+'"'+ta+' style="display:block;width:100%;border-radius:2px"></div></div>';
  }

  if (Gl) {
    const glAlt = alt || 'Glass Card';
    const glPad = S ? 'padding:16px' : 'padding:10px';
    const glSd = S ? 'box-shadow:0 16px 48px rgba(0,0,0,0.25),0 4px 12px rgba(0,0,0,0.15)' : 'box-shadow:0 8px 32px rgba(0,0,0,0.15)';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.18);border-radius:16px;' + glPad + ';' + glSd + 'background-image:linear-gradient(135deg,rgba(255,255,255,0.1),transparent,rgba(255,255,255,0.05));position:relative;overflow:hidden">' +
           '<div style="position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.08),transparent 60%);pointer-events:none"></div>' +
           '<img src="'+src+'" alt="'+glAlt+'"'+ta+' style="display:block;width:100%;border-radius:8px;position:relative;z-index:1"></div>';
  }

  if (Gr) {
    const gradStyle = S
      ? 'padding:4px;background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#9b59b6);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3)'
      : 'padding:3px;background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#9b59b6);border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.2)';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;' + gradStyle + '">' +
           '<div style="background:#fff;padding:2px;border-radius:12px">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:10px"></div></div>';
  }

  if (Fl) {
    const angle = ((src.charCodeAt(0) || 65) + (src.charCodeAt(1) || 65)) % 20;
    const rot = (angle > 10 ? angle - 20 : angle).toFixed(1) + 'deg';
    const fltStyle = S
      ? 'transform:perspective(600px) rotateX(4deg) rotateY(-4deg) rotate('+rot+') translateZ(20px);box-shadow:16px 16px 40px rgba(0,0,0,0.4),-8px -8px 24px rgba(255,255,255,0.6)'
      : 'transform:perspective(600px) rotateX(4deg) rotateY(-4deg) rotate('+rot+') translateZ(10px);box-shadow:8px 8px 24px rgba(0,0,0,0.3),-4px -4px 12px rgba(255,255,255,0.4)';
    return '<div style="display:block;max-width:100%;margin:1.8em auto;padding:12px;background:linear-gradient(135deg,#e8eaf6,#f5f7fa,#e8eaf6);border-radius:16px;' + fltStyle + ';border:1px solid rgba(255,255,255,0.8)">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:8px"></div>';
  }

  if (G) {
    const gsd = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.35)' : 'box-shadow:0 4px 16px rgba(0,0,0,0.2)';
    return '<div style="display:block;max-width:100%;margin:1em;padding:4px;background:#fff;border:1px solid #ddd;' + gsd + '">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;filter:grayscale(1) contrast(1.1);border-radius:4px"></div>';
  }

  if (TV) {
    const tvName = alt || 'CRT TV';
    const tvShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : 'box-shadow:0 4px 16px rgba(0,0,0,0.25)';
    return '<div style="display:block;max-width:280px;margin:1.5em auto">' +
           '<div style="background:#2d2d2d;border-radius:16px 16px 0 0;padding:8px 12px;display:flex;align-items:center;justify-content:space-between">' +
           '<div style="display:flex;gap:6px;align-items:center">' +
           '<div style="width:16px;height:16px;border-radius:50%;background:#cc2222;box-shadow:inset 0 -2px 4px rgba(0,0,0,0.3)"></div>' +
           '<div style="width:16px;height:16px;border-radius:50%;background:#1e8f23;box-shadow:inset 0 -2px 4px rgba(0,0,0,0.3)"></div></div>' +
           '<div style="display:flex;gap:8px;align-items:center">' +
           '<div style="width:20px;height:14px;background:#1a1a1a;border:1px solid #444;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#888;font-family:sans-serif">|</div>' +
           '<div style="width:20px;height:14px;background:#1a1a1a;border:1px solid #444;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#888;font-family:sans-serif">&#xB7;</div></div></div>' +
           '<div style="background:#111;border-radius:0 0 8px 8px;overflow:hidden;border:3px solid #2d2d2d;border-top:none;' + tvShadow + '">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>' +
           '<div style="padding:4px 8px 0;font-size:10px;color:#666;font-family:sans-serif;display:flex;justify-content:space-between"><span>CRT TV</span><span>'+tvName+'</span></div></div>';
  }

  if (Ne) {
    const neonAlt = alt || 'Neon';
    const neonStyle = S ? 'box-shadow:0 0 15px #0ff,0 0 30px #f0f,0 0 45px #ff0,0 0 60px rgba(0,240,255,0.5)' : 'box-shadow:0 0 8px #0ff,0 0 16px #f0f,0 0 24px #ff0';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;padding:3px;background:linear-gradient(135deg,#0ff,#f0f,#ff0);border-radius:12px;' + neonStyle + '">' +
           '<div style="background:#111;padding:4px;border-radius:10px">' +
           '<img src="'+src+'" alt="'+neonAlt+'"'+ta+' style="display:block;max-width:100%;border-radius:6px"></div>' +
           '<p style="text-align:center;color:#0ff;font-size:11px;margin:6px 0 0;font-family:monospace;letter-spacing:2px;text-shadow:0 0 8px #0ff">&#x26A1; '+neonAlt+'</p></div>';
  }

  if (V) {
    const vtAlt = alt || 'Vintage Photo';
    const vtStyle = S ? 'box-shadow:8px 8px 20px rgba(139,119,101,0.4)' : '';
    return '<div style="display:block;max-width:100%;margin:1em;padding:12px 12px 28px;background:#f5f0e6;border:2px solid #d4c5a9;border-radius:4px;' + vtStyle + '">' +
           '<img src="'+src+'" alt="'+vtAlt+'"'+ta+' style="display:block;width:100%;border-radius:4px;filter:sepia(0.3) contrast(0.95) brightness(0.95)">' +
           '<p style="text-align:center;color:#8b7355;font-size:11px;margin:8px 0 0;font-family:Georgia,serif;font-style:italic">&#8212; '+vtAlt+' &#8212;</p></div>';
  }

  if (Np) {
    const ntxt = alt || 'SPECIAL REPORT 2026';
    const nrot = (((src.charCodeAt(0) || 65) + (src.charCodeAt(1) || 65)) % 11 - 5).toFixed(1) + 'deg';
    const nsd = S ? 'box-shadow:4px 4px 12px rgba(0,0,0,0.25)' : '';
    return '<div style="max-width:360px;margin:1.5em auto;background:#f0e8d6;padding:18px;transform:rotate('+nrot+');border:2px solid #d4c5a9;' + nsd + '">' +
           '<div style="border-bottom:3px solid #333;padding-bottom:8px;margin-bottom:12px;display:flex;align-items:baseline;justify-content:space-between">' +
           '<span style="font-family:Georgia,serif;font-size:9px;color:#666;line-height:1.4">VOL.XXIV &#xB7; 2026<br/>PRICE: Free</span>' +
           '<span style="font-size:20px;font-family:Georgia,serif;font-weight:bold;color:#1a1a1a;text-align:center;line-height:1;margin:0 auto">'+ntxt+'</span>' +
           '<span style="font-size:9px;font-family:Georgia,serif;text-align:right;line-height:1.4">THE DIGEST<br/>&#9733;</span></div>' +
           '<div style="border-top:1px solid #333;padding-top:12px;margin-bottom:12px">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>' +
           '<div style="border-top:3px solid #333;margin-top:16px;padding-top:8px;display:flex;justify-content:space-between;font-family:Georgia,serif;font-size:9px;color:#666">' +
           '<span>&#9733; NEWS FROM THE EDITOR DESK</span><span>PAGE A1</span></div></div>';
  }

  if (Nt) {
    const noteTxt = alt || '随手记录';
    const nrot = (((src.charCodeAt(0) || 65) + (src.charCodeAt(1) || 65)) % 7 - 3).toFixed(1) + 'deg';
    return '<div style="display:block;max-width:240px;margin:1.5em auto;position:relative;transform:rotate('+nrot+')">' +
           '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:40px;height:16px;background:rgba(255,230,120,0.7);border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,0.15)"></div>' +
           '<div style="background:#fff9c4;padding:16px 14px 24px;border-radius:2px;box-shadow:2px 3px 10px rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.08)">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:4px;filter:contrast(1.05) brightness(1.02)">' +
           '<p style="text-align:center;color:#5d4037;font-size:13px;margin:10px 0 0;font-family:KaiTi,STKaiti,serif;font-style:italic">'+noteTxt+'</p></div></div>';
  }

  if (I) {
    const ipShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : 'box-shadow:0 4px 20px rgba(0,0,0,0.3)';
    return '<div style="display:block;max-width:420px;margin:1.2em auto;padding:10px 10px 16px;background:#1e293b;border-radius:20px;' + ipShadow + '">' +
           '<div style="width:60px;height:4px;background:#334155;border-radius:4px;margin:0 auto 10px"></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:12px"></div>';
  }

  if (O) {
    const photoCaption = alt || 'Photo';
    const polShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.35)' : 'box-shadow:0 4px 16px rgba(0,0,0,0.2)';
    return '<div style="display:inline-block;max-width:100%;margin:1em;padding:10px 10px 28px;background:#fff;border-radius:4px;' + polShadow + '">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:2px">' +
           '<p style="text-align:center;color:#666;font-size:12px;margin-top:8px;font-family:-apple-system,sans-serif">'+photoCaption+'</p></div>';
  }

  if (F) {
    const filmTitle = alt || 'Film';
    const filmShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.5)' : 'box-shadow:0 6px 24px rgba(0,0,0,0.3)';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;padding:6px 6px 6px;border-radius:4px;background:#1a1a1a;' + filmShadow + '">' +
           '<div style="background:#000;padding:4px;border-radius:2px">' +
           '<img src="'+src+'" alt="'+filmTitle+'"'+ta+' style="display:block;width:100%;border-radius:2px;filter:contrast(1.1) brightness(0.92) sepia(0.15)"></div>' +
           '<p style="color:#aaa;font-size:11px;text-align:center;margin:6px 0 0;font-family:monospace;letter-spacing:2px">'+filmTitle+'</p>' +
           '<div style="display:flex;justify-content:space-between;margin-top:4px">' +
           '<span style="color:#666;font-size:9px;font-family:monospace">2026 &middot; FILM</span>' +
           '<span style="color:#666;font-size:9px;font-family:monospace">MINIMAX &middot; 50mm F1.8 ISO400</span></div></div>';
  }

  if (L) {
    const termPath = alt || '~/code/project';
    const termShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : '';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;' + termShadow + ';border:1px solid #2d2d2d;background:#1e1e1e">' +
           '<div style="background:#323232;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2d2d2d">' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#28c840;display:inline-block"></span>' +
           '<span style="flex:1"></span>' +
           '<span style="background:#1e1e1e;border:1px solid #4a4a4a;border-radius:4px;padding:3px 10px;color:#ccc;font-size:11px;font-family:Menlo,Monaco,monospace">root@localhost:' + termPath + '</span>' +
           '<span style="width:8px"></span></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>';
  }

  if (M) {
    const macTitle = alt || 'Screenshot';
    const macShadow = S ? 'box-shadow:0 12px 40px rgba(0,0,0,0.5)' : 'box-shadow:0 8px 30px rgba(0,0,0,0.3)';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:10px;overflow:hidden;' + macShadow + ';border:1px solid #2d2d2d;background:#1e1e1e">' +
           '<div style="background:#2d2d2d;padding:10px 14px;display:flex;align-items:center;gap:8px">' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#28c840"></span>' +
           '<span style="flex:1;text-align:center;color:#999;font-size:12px;font-family:-apple-system,sans-serif">'+macTitle+'</span></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>';
  }

  if (W) {
    const browserUrl = alt || 'https://example.com';
    const browserShadow = S ? 'box-shadow:0 10px 36px rgba(0,0,0,0.35)' : 'box-shadow:0 6px 24px rgba(0,0,0,0.25)';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:8px;overflow:hidden;' + browserShadow + ';border:1px solid #d1d5db;background:#fff">' +
           '<div style="background:#f3f4f6;padding:8px 12px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #d1d5db">' +
           '<span style="font-size:14px">&#128274;</span>' +
           '<span style="flex:1;color:#6b7280;font-size:12px;font-family:-apple-system,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+browserUrl+'</span></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>';
  }

  if (P) {
    const phoneShadow = S ? 'box-shadow:0 8px 30px rgba(0,0,0,0.4)' : 'box-shadow:0 4px 20px rgba(0,0,0,0.3)';
    return '<div style="display:block;max-width:320px;margin:1.2em auto;padding:8px 8px 12px;background:#1e293b;border-radius:24px;' + phoneShadow + '">' +
           '<div style="width:60px;height:4px;background:#334155;border-radius:4px;margin:0 auto 8px"></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border-radius:16px"></div>';
  }

  if (C) {
    const codeLang = alt || 'python';
    const codeShadow = S ? 'box-shadow:0 10px 40px rgba(0,0,0,0.35)' : 'box-shadow:0 6px 24px rgba(0,0,0,0.2)';
    return '<div style="display:block;max-width:100%;margin:1.2em auto;border-radius:10px;overflow:hidden;' + codeShadow + ';border:1px solid #2d333b;background:#0d1117">' +
           '<div style="background:#161b22;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2d333b">' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span>' +
           '<span style="width:12px;height:12px;border-radius:50%;background:#28c840"></span>' +
           '<span style="flex:1"></span>' +
           '<span style="background:#1f2430;border:1px solid #2d333b;border-radius:4px;padding:3px 12px;color:#8b949e;font-size:12px;font-family:Menlo,Monaco,monospace">'+codeLang+'</span></div>' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%"></div>';
  }

  if (Cp) {
    return '<figure style="margin:1.2em auto;text-align:center">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;max-width:100%;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">' +
           '<figcaption style="text-align:center;color:#94a3b8;font-size:13px;margin-top:0.5em;font-style:italic">'+alt+'</figcaption></figure>';
  }

  // focus 聚焦暗角
  if (Fs) {
    const fsAlt = alt || 'Focus';
    const fsSd = S ? 'box-shadow:0 6px 24px rgba(0,0,0,0.4)' : '';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;position:relative;overflow:hidden;border-radius:8px;' + fsSd + '">' +
           '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.55) 100%);pointer-events:none;z-index:2;border-radius:8px"></div>' +
           '<img src="'+src+'" alt="'+fsAlt+'"'+ta+' style="display:block;width:100%;border-radius:8px;filter:contrast(1.05) brightness(0.95)"></div>';
  }

  if (Sl) {
    const slSd = S ? 'box-shadow:0 4px 16px rgba(0,0,0,0.3)' : '';
    return '<div style="display:block;margin:1em auto;max-width:100%;' + slSd + '">' +
           '<img src="'+src+'" alt="'+alt+'"'+ta+' style="display:block;width:100%;border:1px solid rgba(0,0,0,0.12);border-radius:6px;"></div>';
  }

  // pin Pinterest 风格
  if (Pn) {
    const pnAlt = alt || 'Pinterest';
    const pnSd = S ? 'box-shadow:0 8px 24px rgba(0,0,0,0.15)' : 'box-shadow:0 3px 10px rgba(0,0,0,0.1)';
    return '<div style="display:block;max-width:100%;margin:1.5em auto;' + pnSd + '">' +
           '<img src="'+src+'" alt="'+pnAlt+'"'+ta+' style="display:block;width:100%;border-radius:8px;">' +
           '<p style="text-align:center;color:#8a8a8a;font-size:12px;margin:6px 0 0;font-family:-apple-system,sans-serif;">'+pnAlt+'</p></div>';
  }

  let style = 'display:block;max-width:100%;margin:1.2em auto;border-radius:8px;';
  if (B) style += 'border:2px solid #334155;';
  if (S) style += 'box-shadow:0 4px 20px rgba(0,0,0,0.4);';
  return '<img src="'+src+'" alt="'+alt+'"'+ta+' style="'+style+'">';
}

function resolveCssVars(css, vars) {
  let result = css;
  for (let i = 0; i < 10; i++) {
    const prev = result;
    result = result.replace(/var\(--([\w-]+)(?:,\s*([^)]*))?\)/g, (_, n, f) => vars['--' + n] || f || 'inherit');
    if (result === prev) break;
  }
  return result;
}

function applyCss(html, theme) {
  const baseCss = fs.readFileSync(path.join(SKILL_DIR, 'base.css'), 'utf8');
  const themeCss = fs.readFileSync(path.join(SKILL_DIR, theme + '.css'), 'utf8');
  const vars = {
    '--md-primary-color': '#1a56db',
    '--md-font-family': 'Optima-Regular,Optima,PingFangSC-light,PingFangTC-light,"PingFang SC",Cambria,Georgia,Times,"Times New Roman",serif',
    '--md-font-size': '16px',
    '--foreground': '0, 0, 0',
    '--blockquote-background': 'rgba(0,0,0,0.05)',
    '--el-primary': '#1a56db','--el-bg': '#0f172a','--el-surface': '#1e293b',
    '--el-border': '#334155','--el-text': '#e2e8f0','--el-muted': '#94a3b8',
    '--el-accent': '#3b82f6','--el-green': '#10b981','--el-red': '#ef4444',
    '--el-yellow': '#f59e0b','--el-purple': '#8b5cf6',
  };
  let css = resolveCssVars(baseCss + '\n' + themeCss, vars);
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selMap = {};
  const re = /([^{]+)\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const sel = m[1].trim();
    if (!selMap[sel]) selMap[sel] = [];
    selMap[sel].push(m[2].trim());
  }
  let result = html;
  for (const tag of ['p','h1','h2','h3','h4','h5','h6','blockquote','code','pre','a','strong','em','hr','ul','ol','li','figure']) {
    if (!selMap[tag]) continue;
    const props = selMap[tag].join(' ');
    if (!props) continue;
    const r = new RegExp('<'+tag+'([^>]*?)(style="[^"]*")?([^>]*?)>', 'gi');
    result = result.replace(r, (match, a, b, c) => b ? match : '<'+tag+a+' style="'+props+'"'+c+'>');
  }
  return result;
}

async function publishDraft({ mdPath, coverPath, title, digest, theme }) {
  console.log('[' + theme + '] 1. 获取 access_token...');
  const token = JSON.parse(execSync('curl -s "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET + '"')).access_token;
  console.log('2. 压缩封面...');
  const sharp = require('/usr/local/lib/node_modules/kuaifa/node_modules/sharp');
  const thumbPath = '/tmp/wechat-thumb.jpg';
  await sharp(coverPath).resize(300, 300, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(thumbPath);
  console.log('   封面: ' + (fs.statSync(thumbPath).size / 1024).toFixed(1) + 'KB');
  console.log('3. 上传封面...');
  const thumbRes = execSync('curl -s -F media=@' + thumbPath + ' "https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=' + token + '&type=thumb"');
  const thumbData = JSON.parse(thumbRes);
  if (!thumbData.media_id) return { errcode: -1, errmsg: JSON.stringify(thumbData) };
  console.log('   thumb_media_id: ' + thumbData.media_id);
  console.log('4. Markdown -> HTML...');
  const md = fs.readFileSync(mdPath, 'utf8');
  const content = applyCss(md2html(md), theme);
  console.log('   HTML 长度: ' + content.length);
  console.log('5. 创建草稿...');
  const payload = { articles: [{ title, thumb_media_id: thumbData.media_id, author: '莫殇', digest: digest || '', content, show_cover_pic: 1, need_open_comment: 1, only_fans_can_comment: 0 }] };
  const postData = JSON.stringify(payload).replace(/'/g, "\\u0027");
  const draftRes = execSync('curl -s -X POST -H "Content-Type: application/json" -d \'' + postData + '\' "https://api.weixin.qq.com/cgi-bin/draft/add?access_token=' + token + '"');
  const result = JSON.parse(draftRes);
  if (result.media_id) console.log('✅ 草稿创建成功! media_id: ' + result.media_id);
  else console.error('❌ 失败:', result);
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
    console.log('效果: border shadow rounded phone macos browser terminal polaroid film neon vintage tv code note ipad newspaper grayscale float gradient caption');
    process.exit(1);
  }
  publishDraft({ mdPath, coverPath, title, digest: digest || '', theme })
    .then(r => { if (!r.media_id) process.exit(1); })
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { publishDraft };