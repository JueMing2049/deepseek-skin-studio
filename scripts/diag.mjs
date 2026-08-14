import { writeFileSync } from 'node:fs';
const port = 9331;
const res = await fetch(`http://127.0.0.1:${port}/json/list`);
const targets = await res.json();
console.log('pages:', targets.filter(t => t.type === 'page').map(t => t.url).join(' | '));
const page = targets.find(t => t.type === 'page' && t.url && t.url.includes('127.0.0.1:3080')) || targets.find(t => t.type === 'page');
if (!page) { console.error('no page'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('ws fail')); });
let idc = 0;
const send = (method, params) => new Promise((ok, no) => {
  const id = ++idc;
  const on = e => { const m = JSON.parse(e.data); if (m.id === id) { ws.removeEventListener('message', on); ok(m); } };
  ws.addEventListener('message', on);
  ws.send(JSON.stringify({ id, method, params }));
  setTimeout(() => no(new Error('timeout: ' + method)), 8000);
});
await send('Page.bringToFront', {});
const diag = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    title: document.title,
    url: location.href,
    readyState: document.readyState,
    capsule: !!document.getElementById('dsskin-menu'),
    capsuleRect: (function(){var el=document.getElementById('dsskin-menu');return el?JSON.stringify(el.getBoundingClientRect()):null})(),
    dshBg: getComputedStyle(document.documentElement).getPropertyValue('--dsh-bg'),
    aliasBg: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base'),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyText: (document.body.innerText||'').slice(0,100)
  })`, returnByValue: true });
console.log('DIAG:', diag.result?.result?.value);
await send('Runtime.evaluate', { expression: `(function(){var d=document.createElement('div');d.id='dsskin-toast';d.style.cssText='position:fixed;left:50%;top:16%;transform:translateX(-50%);z-index:2147483647;background:linear-gradient(90deg,#2f6fe4,#38bdf8);color:#fff;font:700 17px system-ui,sans-serif;padding:14px 28px;border-radius:14px;box-shadow:0 10px 40px rgba(47,111,228,.55)';d.textContent='🐋 鲸鱼娘皮肤已注入本窗口 · DeepSeek Skin Studio';document.body.appendChild(d);setTimeout(function(){d.remove()},10000)})()` });
await new Promise(r => setTimeout(r, 1200));
const shot = await send('Page.captureScreenshot', { format: 'png' });
ws.close();
if (shot.result?.data) {
  writeFileSync('C:/Users/asus/Desktop/DSH/deepseek-skin-studio/dist/whale-girl-live2.png', Buffer.from(shot.result.data, 'base64'));
  console.log('screenshot saved: dist/whale-girl-live2.png');
}
