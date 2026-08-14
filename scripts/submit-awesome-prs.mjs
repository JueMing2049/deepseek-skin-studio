const TOKEN = process.env.GH_TOKEN;
const H = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'dsh-pr' };
async function api(method, path, body) {
  const r = await fetch('https://api.github.com' + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  return j;
}
const addEn = '- [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) - DeepSeek Harness skin studio: one image = one skin; three injection channels (bookmarklet / CDP / native plugin), visual studio, 13 built-in themes, DSH-SKIN-SPEC v0.1 export.';
const addZh = '- [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) - DeepSeek Harness 换肤工作室：一张图一套皮肤；书签 / CDP / 原生插件三通道注入，可视化工坊，13 套内置主题，支持导出 DSH-SKIN-SPEC v0.1 皮肤包。';
const addRow = '| deepseek-skin-studio | [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) | DSH 换肤工作室：一张图一套皮肤，三通道注入（书签/CDP/原生插件）+ 可视化工坊 + 13 套内置主题 + DSH-SKIN-SPEC 导出 | 待测 |';

async function editFile(fork, path, editFn, msg) {
  const f = await api('GET', `/repos/${fork}/contents/${path}?ref=main`);
  let text = Buffer.from(f.content, 'base64').toString('utf8');
  const out = editFn(text);
  if (out === text) { console.log(`${path}: unchanged (maybe already present)`); return; }
  const base64 = Buffer.from(out, 'utf8').toString('base64');
  await api('PUT', `/repos/${fork}/contents/${path}`, { message: msg, content: base64, branch: 'add-deepseek-skin-studio', sha: f.sha });
  console.log(`${path}: committed to branch add-deepseek-skin-studio`);
}
async function setupFork(fork) {
  const ref = await api('GET', `/repos/${fork}/git/ref/heads/main`);
  try { await api('POST', `/repos/${fork}/git/refs`, { ref: 'refs/heads/add-deepseek-skin-studio', sha: ref.object.sha }); console.log(`${fork}: branch created`); }
  catch (e) { console.log(`${fork}: branch exists or ${e.message.slice(0, 80)}`); }
}
async function openPr(upstream, fork, title, body) {
  try {
    const pr = await api('POST', `/repos/${upstream}/pulls`, { title, body, head: `${fork.split('/')[0]}:add-deepseek-skin-studio`, base: 'main' });
    console.log(`PR: ${pr.html_url}`);
  } catch (e) { console.log(`PR FAILED: ${e.message.slice(0, 160)}`); }
}

/* ===== repo 1: awesome-dsh-plugin/awesome-dsh-plugin ===== */
const fork1 = 'JueMing2049/awesome-dsh-plugin';
await setupFork(fork1);
await editFile(fork1, 'README.md', t => {
  if (t.includes('deepseek-skin-studio')) return t;
  const anchor = '- [tianyhjg-lab/dsh-font]';
  const i = t.indexOf(anchor); const eol = t.indexOf('\n', i);
  return t.slice(0, eol + 1) + addEn + '\n' + t.slice(eol + 1);
}, 'Add DeepSeek-Skin-Studio to Themes & Appearance');
await editFile(fork1, 'README.zh.md', t => {
  if (t.includes('deepseek-skin-studio')) return t;
  const h = t.indexOf('### 🎭 主题与外观');
  if (h < 0) return t;
  const end = t.indexOf('\n### ', h + 5);
  const segEnd = end < 0 ? t.length : end;
  const lastItem = t.lastIndexOf('\n- [', segEnd);
  const eol = t.indexOf('\n', lastItem);
  return t.slice(0, eol + 1) + addZh + '\n' + t.slice(eol + 1);
}, 'Add DeepSeek-Skin-Studio to Themes & Appearance (中文)');
await openPr('awesome-dsh-plugin/awesome-dsh-plugin', fork1, 'Add DeepSeek-Skin-Studio to Themes & Appearance',
  'Add [deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) to the Themes & Appearance section.\n\n- One image = one skin (auto color extraction)\n- Three injection channels: bookmarklet / CDP / native DSH-SKIN-SPEC plugin\n- Visual studio + 13 built-in themes\n- DSH-SKIN-SPEC v0.1 export (standard skin package)\n- topics: dsh-plugin · dsh · cordis');

/* ===== repo 2: AdamPlatin123/awesome-dsh-plugins ===== */
const fork2 = 'JueMing2049/awesome-dsh-plugins';
await setupFork(fork2);
await editFile(fork2, 'PLUGINS.md', t => {
  if (t.includes('deepseek-skin-studio')) return t;
  const h = t.indexOf('## 🔌 单插件');
  const nextH = t.indexOf('\n## ', h + 1);
  const end = nextH < 0 ? t.length : nextH;
  const eol = t.lastIndexOf('\n', end - 1);
  return t.slice(0, eol + 1) + addRow + '\n' + t.slice(eol + 1);
}, 'Add deepseek-skin-studio to plugin registry (skin/tooling)');
await openPr('AdamPlatin123/awesome-dsh-plugins', fork2, 'Add deepseek-skin-studio (DSH 换肤工作室)',
  'Add [deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) under 🔌 单插件.\n\nDSH Web UI skin studio: one image = one skin; bookmarklet / CDP / native plugin three-channel injection; visual studio; 13 built-in themes; DSH-SKIN-SPEC v0.1 export. runtime: 待测.');
