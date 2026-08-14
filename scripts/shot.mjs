import { writeFileSync } from 'node:fs';
const port = 9331;
const res = await fetch(`http://127.0.0.1:${port}/json/list`);
const targets = await res.json();
const page = targets.find(t => t.type === 'page' && t.url && t.url.includes('127.0.0.1:3080')) || targets.find(t => t.type === 'page');
if (!page) { console.error('no page'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('ws fail')); });
const shot = await new Promise((ok, no) => {
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id === 1) ok(m); };
  ws.send(JSON.stringify({ id: 1, method: 'Page.captureScreenshot', params: { format: 'png' } }));
  setTimeout(() => no(new Error('timeout')), 8000);
});
ws.close();
if (shot.result?.data) {
  writeFileSync('C:/Users/asus/Desktop/DSH/deepseek-skin-studio/dist/whale-girl-live.png', Buffer.from(shot.result.data, 'base64'));
  console.log('screenshot saved: dist/whale-girl-live.png (' + Math.round(shot.result.data.length / 1024) + ' KB base64)');
} else { console.error('no screenshot data; raw:', JSON.stringify(shot).slice(0, 300)); process.exit(1); }
