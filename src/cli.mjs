#!/usr/bin/env node
/* DeepSeek Skin Studio CLI · v0.1 · Node >= 22（使用内置 fetch / WebSocket） */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES_DIR = join(ROOT, 'themes');
const DEFAULT_PORT = 9331;
const DEFAULT_URL = 'http://127.0.0.1:3080';

const help = `DeepSeek Skin Studio CLI

用法: node src/cli.mjs <command> [options]

命令:
  list                                  列出全部内置主题
  create --name <id> [--hero <file>] [--colors <json>]   创建主题到 themes/
  apply [--theme <id>] [--port <n>] [--url <u>]          CDP 注入（默认调试端口 9331）
  status [--port <n>]                                    查询注入状态
  pause [--port <n>]                                     恢复原生外观
  doctor                                                 环境自检
  snippet --theme <id>                                   输出书签/控制台片段
  export-spec --theme <id> --out <dir>                   导出 DSH-SKIN-SPEC 皮肤包
`;

function loadThemes() {
  const out = [];
  for (const f of readdirSync(THEMES_DIR)) {
    if (!f.endsWith('.json')) continue;
    try {
      const t = JSON.parse(readFileSync(join(THEMES_DIR, f), 'utf8'));
      if (t && t.schemaVersion === 1 && t.id && t.name) out.push(t);
    } catch { /* skip broken */ }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}
function findTheme(id) {
  const ts = loadThemes();
  const t = ts.find(x => x.id === id);
  if (!t) { console.error(`未找到主题: ${id}\n可用: ${ts.map(x => x.id).join(', ')}`); process.exit(1); }
  return t;
}
const DEFAULT_COLORS = { accent: '#4d6bfe', secondary: '#22d3ee', accent3: '#a78bfa', surface: '#0d1526', panel: '#111b31', bg: '#070b14', border: '#1d2a45', text: '#e6ebf5', muted: '#8b98b3', ok: '#34d399', warn: '#fbbf24', danger: '#f87171' };

/* ---------- 注入载荷：CSS 变量 + 背景 + 🎨 主题菜单 ---------- */
function injectPayload(themeId) {
  const ts = loadThemes();
  const norm = t => ({ ...DEFAULT_COLORS, ...(t.colors || {}) });
  return `(function(){
  var THEMES=${JSON.stringify(ts.map(t => ({ id: t.id, name: t.name, colors: norm(t) })))};
  function css(colors){
    var mix=function(c,a){return 'color-mix(in srgb,'+c+' '+a+'%,transparent)'};
    var dsh=':root{'
      + '--dsh-bg:'+colors.bg+';--dsh-bg-2:'+colors.bg+';--dsh-panel:'+colors.surface+';--dsh-panel-2:'+colors.panel+';'
      + '--dsh-border:'+colors.border+';--dsh-border-2:'+colors.border+';--dsh-text:'+colors.text+';--dsh-muted:'+colors.muted+';--dsh-dim:'+colors.muted+';'
      + '--dsh-accent:'+colors.accent+';--dsh-accent-2:'+colors.secondary+';--dsh-accent-3:'+colors.accent3+';'
      + '--dsh-ok:'+colors.ok+';--dsh-warn:'+colors.warn+';--dsh-danger:'+colors.danger+';'
      + '}';
    var real='body,html{'
      + '--dsw-alias-bg-base:'+colors.bg+'!important;'
      + '--dsw-alias-bg-layer-1:'+colors.panel+'!important;'
      + '--dsw-alias-bg-layer-2:'+colors.surface+'!important;'
      + '--dsw-alias-bg-layer-3:'+colors.surface+'!important;'
      + '--dsw-alias-bg-overlay:'+colors.surface+'!important;'
      + '--dsw-alias-bg-module-platform:'+colors.bg+'!important;'
      + '--dsw-alias-bg-skeleton:'+mix(colors.accent,8)+'!important;'
      + '--dsw-alias-brand-primary:'+colors.accent+'!important;'
      + '--dsw-alias-brand-primary-invert:'+colors.bg+'!important;'
      + '--dsw-alias-brand-text:'+colors.text+'!important;'
      + '--dsw-alias-label-primary:'+colors.text+'!important;'
      + '--dsw-alias-label-primary-bluish:'+colors.text+'!important;'
      + '--dsw-alias-label-primary-foreground:'+colors.text+'!important;'
      + '--dsw-alias-label-secondary:'+colors.muted+'!important;'
      + '--dsw-alias-label-tertiary:'+colors.muted+'!important;'
      + '--dsw-alias-label-dimmed:'+colors.muted+'!important;'
      + '--dsw-alias-label-caption:'+colors.muted+'!important;'
      + '--dsw-alias-border-l1:'+mix(colors.border,45)+'!important;'
      + '--dsw-alias-border-l2:'+mix(colors.border,70)+'!important;'
      + '--dsw-alias-border-l3:'+mix(colors.border,85)+'!important;'
      + '--dsw-alias-border-l4:'+colors.border+'!important;'
      + '--dsw-alias-button-info-fill:'+colors.accent+'!important;'
      + '--dsw-alias-button-info-hover:'+colors.secondary+'!important;'
      + '--dsw-alias-button-primary-fill:'+colors.accent+'!important;'
      + '--dsw-alias-button-primary-hover:'+colors.secondary+'!important;'
      + '--dsw-alias-interactive-bg-hover:'+mix(colors.accent,9)+'!important;'
      + '--dsw-alias-interactive-bg-active:'+mix(colors.accent,15)+'!important;'
      + '--dsw-alias-interactive-bg-hover-accent:'+mix(colors.accent,17)+'!important;'
      + '--dsw-alias-state-success-primary:'+colors.ok+'!important;'
      + '--dsw-alias-state-warn-primary:'+colors.warn+'!important;'
      + '--dsw-alias-state-error-primary:'+colors.danger+'!important;'
      + '--dsw-specific-sidebar-fill:'+colors.bg+'!important;'
      + '--dsw-specific-sidebar-nav-item-active-accent:'+colors.accent+'!important;'
      + '--dsw-specific-sidebar-nav-item-active:'+mix(colors.accent,14)+'!important;'
      + '--dsw-specific-sidebar-nav-item-hover:'+mix(colors.accent,8)+'!important;'
      + '--dsw-alias-markdown-code-block:'+colors.panel+'!important;'
      + '--dsw-alias-markdown-inline-code:'+mix(colors.accent,14)+'!important;'
      + '--dsw-alias-toast-bg:'+colors.panel+'!important;'
      + '--dsw-alias-tooltip-bg:'+colors.surface+'!important;'
      + '--dsw-hovercard-bg:'+colors.panel+'!important;'
      + '--dsh-scrollbar-thumb:'+colors.border+'!important;'
      + '--dsh-scrollbar-thumb-hover:'+mix(colors.accent,45)+'!important;'
      + '}';
    var aura='body{background-image:radial-gradient(1200px 600px at 85% -10%,'+mix(colors.accent,16)+',transparent 60%)!important}';
    return dsh+real+aura;
  }
  function apply(id){
    var t=THEMES.find(function(x){return x.id===id}); if(!t)return;
    var st=document.getElementById('dsskin-style');
    if(!st){st=document.createElement('style');st.id='dsskin-style';document.head.appendChild(st);}
    st.textContent=css(t.colors);
    window.__dsskin__={applied:true,theme:id};
    var m=document.getElementById('dsskin-menu'); if(m){var b=m.querySelector('[data-active]');if(b){b.textContent=t.name;b.setAttribute('data-active',id);} }
  }
  function ensureMenu(){
    if(document.getElementById('dsskin-menu'))return;
    var m=document.createElement('div');m.id='dsskin-menu';
    m.style.cssText='position:fixed;top:12px;right:12px;z-index:2147483000;display:flex;gap:6px;background:rgba(10,14,24,.9);border:1px solid rgba(120,140,180,.4);border-radius:999px;padding:6px 10px;backdrop-filter:blur(8px);font:12px/1.6 system-ui,sans-serif;';
    var active=document.createElement('span');active.textContent='';active.setAttribute('data-active','');
    active.style.cssText='color:#7fd4ff;cursor:pointer;';
    active.onclick=function(){
      var list=document.getElementById('dsskin-list');
      list.style.display=list.style.display==='block'?'none':'block';
    };
    m.appendChild(active);
    var list=document.createElement('div');list.id='dsskin-list';
    list.style.cssText='display:none;position:fixed;top:46px;right:12px;z-index:2147483000;background:rgba(10,14,24,.96);border:1px solid rgba(120,140,180,.4);border-radius:10px;padding:6px;min-width:180px;';
    THEMES.forEach(function(t){
      var b=document.createElement('button');
      b.textContent=t.name;
      b.style.cssText='display:block;width:100%;text-align:left;background:none;border:none;color:#dfe7f7;padding:6px 10px;border-radius:6px;cursor:pointer;font:12px/1.6 system-ui,sans-serif;';
      b.onmouseenter=function(){b.style.background='rgba(77,107,254,.25)'};
      b.onmouseleave=function(){b.style.background='none'};
      b.onclick=function(){apply(t.id)};
      list.appendChild(b);
    });
    var r=document.createElement('button');
    r.textContent='⚙ 原生界面';
    r.style.cssText='display:block;width:100%;text-align:left;background:none;border:none;color:#f0a8a8;padding:6px 10px;border-radius:6px;cursor:pointer;font:12px/1.6 system-ui,sans-serif;';
    r.onclick=function(){
      var st=document.getElementById('dsskin-style'); if(st)st.remove();
      var mn=document.getElementById('dsskin-menu'); if(mn)mn.remove();
      var li=document.getElementById('dsskin-list'); if(li)li.remove();
      window.__dsskin__={applied:false};
    };
    list.appendChild(r);
    document.body.appendChild(m);document.body.appendChild(list);
  }
  ensureMenu();
  apply(${JSON.stringify(themeId)});
})();`;
}
function pausePayload() {
  return `(function(){var st=document.getElementById('dsskin-style');if(st)st.remove();var m=document.getElementById('dsskin-menu');if(m)m.remove();var l=document.getElementById('dsskin-list');if(l)l.remove();window.__dsskin__={applied:false};return 'paused';})()`;
}

/* ---------- CDP ---------- */
async function cdpTargets(port) {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!res.ok) throw new Error(`CDP /json/list ${res.status}`);
  return res.json();
}
async function cdpEval(port, expression) {
  const targets = await cdpTargets(port);
  const page = targets.find(t => t.type === 'page' && t.url && t.url.includes('127.0.0.1:3080')) || targets.find(t => t.type === 'page');
  if (!page) throw new Error('未找到可注入的浏览器页面（请确认浏览器以 --remote-debugging-port 启动且 DSH Web UI 已打开）');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('WebSocket 连接失败')); });
  const result = await new Promise((ok, no) => {
    ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id === 1) ok(m); };
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
    setTimeout(() => no(new Error('CDP 评估超时')), 8000);
  });
  ws.close();
  if (result.result && result.result.exceptionDetails) throw new Error('注入被页面拒绝: ' + JSON.stringify(result.result.exceptionDetails.exception?.description || 'unknown'));
  return page.url;
}

async function cdpEvalValue(port, expression) {
  const targets = await cdpTargets(port);
  const page = targets.find(t => t.type === 'page' && t.url && t.url.includes('127.0.0.1:3080')) || targets.find(t => t.type === 'page');
  if (!page) throw new Error('未找到可注入的浏览器页面（请确认浏览器以 --remote-debugging-port 启动且 DSH Web UI 已打开）');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('WebSocket 连接失败')); });
  const result = await new Promise((ok, no) => {
    ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id === 1) ok(m); };
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
    setTimeout(() => no(new Error('CDP 评估超时')), 8000);
  });
  ws.close();
  if (result.result && result.result.exceptionDetails) throw new Error('注入被页面拒绝: ' + JSON.stringify(result.result.exceptionDetails.exception?.description || 'unknown'));
  return { url: page.url, value: result.result?.result?.value };
}

async function bringToFront(port) {
  try {
    const targets = await cdpTargets(port);
    const page = targets.find(t => t.type === 'page' && t.url && t.url.includes('127.0.0.1:3080')) || targets.find(t => t.type === 'page');
    if (!page) return;
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('ws')); });
    ws.send(JSON.stringify({ id: 9, method: 'Page.bringToFront', params: {} }));
    await new Promise(r => setTimeout(r, 400));
    ws.close();
  } catch { /* 置前失败不阻断 */ }
}

/* ---------- export-spec ---------- */
function exportSpec(theme, outDir) {
  const c = { ...DEFAULT_COLORS, ...(theme.colors || {}) };
  mkdirSync(outDir, { recursive: true });
  const manifest = { dsh: { kind: 'skin', specVersion: '0.1', name: theme.id, displayName: theme.name, version: '0.1.0', author: 'DeepSeek-Skin-Studio', license: 'MIT', description: `${theme.name} · 由 DeepSeek-Skin-Studio 导出`, tags: [], compat: { dsh: '>=0.1.0-rc.5' } } };
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const css = `/* ${theme.name} · DSH-SKIN-SPEC v0.1（由 DeepSeek-Skin-Studio 导出） */\n:root {\n` +
    `  --dsh-bg: ${c.bg};\n  --dsh-bg-2: ${c.bg};\n  --dsh-panel: ${c.surface};\n  --dsh-panel-2: ${c.panel};\n` +
    `  --dsh-border: ${c.border};\n  --dsh-border-2: ${c.border};\n  --dsh-text: ${c.text};\n  --dsh-muted: ${c.muted};\n  --dsh-dim: ${c.muted};\n` +
    `  --dsh-accent: ${c.accent};\n  --dsh-accent-2: ${c.secondary};\n  --dsh-accent-3: ${c.accent3};\n` +
    `  --dsh-ok: ${c.ok};\n  --dsh-warn: ${c.warn};\n  --dsh-danger: ${c.danger};\n  --dsh-radius: 14px;\n}\n`;
  writeFileSync(join(outDir, 'theme.css'), css);
  writeFileSync(join(outDir, 'README.md'), `# ${theme.name}\n\n由 DeepSeek-Skin-Studio 导出的 DSH-SKIN-SPEC v0.1 皮肤包。\n\n安装：\`dsh-skin-cli validate ${basename(outDir)}\` 或交予 skin-loader 装载。\n`);
  return outDir;
}

/* ---------- 命令分发 ---------- */
function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const [,, cmd] = process.argv;

if (!cmd || cmd === 'help' || cmd === '-h') { console.log(help); process.exit(0); }

if (cmd === 'list') {
  loadThemes().forEach(t => console.log(`${t.id.padEnd(18)} ${t.name}`));
} else if (cmd === 'create') {
  const name = arg('--name'); if (!name) { console.error('需要 --name <id>'); process.exit(1); }
  const t = { schemaVersion: 1, id: name, name: arg('--hero', name), hero: arg('--hero', `${name}.png`), colors: arg('--colors') ? JSON.parse(arg('--colors')) : undefined };
  const p = join(THEMES_DIR, `${name}.json`); writeFileSync(p, JSON.stringify(t, null, 2) + '\n');
  console.log(`已创建 ${p}`);
} else if (cmd === 'apply') {
  const theme = findTheme(arg('--theme', 'galaxy-deep'));
  const port = Number(arg('--port', DEFAULT_PORT));
  bringToFront(port)
    .then(() => cdpEval(port, injectPayload(theme.id)))
    .then(r => console.log(`✓ 已注入「${theme.name}」→ ${r.url}\n提示: 页面重载后注入会消失；持续保活用: node src/cli.mjs watch --theme ${theme.id}`))
    .catch(e => { console.error(`✗ ${e.message}\n提示: 先用 --remote-debugging-port=${port} 启动浏览器并打开 DSH，或改用 snippet 通道。`); process.exit(1); });
} else if (cmd === 'watch') {
  const theme = findTheme(arg('--theme', 'whale-girl'));
  const port = Number(arg('--port', DEFAULT_PORT));
  const dur = Number(arg('--minutes', 15));
  const end = Date.now() + dur * 60 * 1000;
  console.log(`watch 常驻模式：每 3 秒检查页面并在重载后重注入「${theme.name}」，持续 ${dur} 分钟（Ctrl+C 停止）`);
  const tick = async () => {
    try {
      const targets = await cdpTargets(port);
      for (const t of targets.filter(x => x.type === 'page' && x.url && x.url.includes('127.0.0.1:3080'))) {
        const ws = new WebSocket(t.webSocketDebuggerUrl);
        await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('ws')); });
        const check = await new Promise((ok, no) => {
          ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id === 1) ok(m); };
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: `!!window.__dsskin__ && window.__dsskin__.theme===${JSON.stringify(theme.id)}`, returnByValue: true } }));
          setTimeout(() => no(new Error('t')), 6000);
        });
        ws.close();
        if (!check.result?.result?.value) {
          await cdpEval(port, injectPayload(theme.id));
          console.log(`[${new Date().toLocaleTimeString()}] 已(重)注入「${theme.name}」`);
        }
      }
    } catch { /* 下轮重试 */ }
    if (Date.now() < end) setTimeout(tick, 3000); else console.log('watch 结束');
  };
  tick();
} else if (cmd === 'status') {
  const port = Number(arg('--port', DEFAULT_PORT));
  cdpEvalValue(port, `JSON.stringify(window.__dsskin__ || { applied: false })`)
    .then(r => console.log(`target: ${r.url}\n注入状态: ${r.value || '(页面未报告)'}`))
    .catch(e => { console.error(`✗ ${e.message}`); process.exit(1); });
} else if (cmd === 'pause') {
  const port = Number(arg('--port', DEFAULT_PORT));
  cdpEval(port, pausePayload()).then(url => console.log(`✓ 已恢复原生外观 → ${url}`)).catch(e => { console.error(`✗ ${e.message}`); process.exit(1); });
} else if (cmd === 'doctor') {
  const [maj] = process.versions.node.split('.').map(Number);
  console.log(`Node: ${process.versions.node} ${maj >= 22 ? '✓' : '✗（需要 >= 22，仅 CLI；书签/工坊不受影响）'}`);
  try { const r = await fetch(DEFAULT_URL, { signal: AbortSignal.timeout(2500) }); console.log(`DSH Web UI ${DEFAULT_URL}: ${r.status} ${r.ok ? '✓' : '⚠'}`); } catch { console.log(`DSH Web UI ${DEFAULT_URL}: ✗ 未检测到（请先运行 npx @deepseek-ai/dsh web）`); }
  try { const t = await cdpTargets(DEFAULT_PORT); console.log(`调试端口 ${DEFAULT_PORT}: ${t.length} 个页面 ${t.length ? '✓' : '(浏览器未以调试模式启动)'}`); } catch { console.log(`调试端口 ${DEFAULT_PORT}: ✗（apply 时可用脚本自动拉起）`); }
} else if (cmd === 'snippet') {
  const theme = findTheme(arg('--theme', 'galaxy-deep'));
  const raw = `javascript:(function(){${injectPayload(theme.id).replace(/^\(function\(\)\{/, '').replace(/\}\)\(\);?$/, '')}})();`;
  console.log('【书签版】复制到浏览器地址栏（或新建书签，地址粘贴此行）：\n');
  console.log('javascript:' + encodeURIComponent(injectPayload(theme.id)) + '\n');
  console.log('【控制台版】粘贴到 DSH 页面 DevTools Console 回车：\n');
  console.log(injectPayload(theme.id) + '\n');
} else if (cmd === 'export-spec') {
  const theme = findTheme(arg('--theme', 'galaxy-deep'));
  const out = arg('--out', join(ROOT, 'dist', `skin.${theme.id}`));
  exportSpec(theme, out);
  console.log(`✓ 已导出 DSH-SKIN-SPEC 皮肤包 → ${out}（manifest.json + theme.css + README.md）`);
} else {
  console.error(`未知命令: ${cmd}\n`); console.log(help); process.exit(1);
}
