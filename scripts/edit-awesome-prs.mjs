import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const work = process.env.TEMP + '\\dsh-prs';

/* 1) awesome-dsh-plugin/README.md —— Themes & Appearance 段 */
const en = join(work, 'awesome-dsh-plugin', 'README.md');
let s = readFileSync(en, 'utf8');
const anchor = '- [tianyhjg-lab/dsh-font]';
const addEn = '- [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) - DeepSeek Harness skin studio: one image = one skin; three injection channels (bookmarklet / CDP / native plugin), visual studio, 13 built-in themes, DSH-SKIN-SPEC v0.1 export.';
if (s.includes('deepseek-skin-studio')) { console.log('EN: already present, skip'); } else if (s.includes(anchor)) {
  const i = s.indexOf(anchor); const eol = s.indexOf('\n', i);
  s = s.slice(0, eol + 1) + addEn + '\n' + s.slice(eol + 1);
  writeFileSync(en, s); console.log('EN: inserted after dsh-font');
} else { console.log('EN: anchor not found!'); }

/* 2) awesome-dsh-plugin/README.zh.md —— 中文主题段（在“### 主题”标题下的最后一个列表项后插入） */
const zh = join(work, 'awesome-dsh-plugin', 'README.zh.md');
let z = readFileSync(zh, 'utf8');
const addZh = '- [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) - DeepSeek Harness 换肤工作室：一张图一套皮肤；书签 / CDP / 原生插件三通道注入，可视化工坊，13 套内置主题，支持导出 DSH-SKIN-SPEC v0.1 皮肤包。';
const headIdx = z.search(/###\s*主题/);
if (z.includes('deepseek-skin-studio')) { console.log('ZH: already present, skip'); }
else if (headIdx >= 0) {
  const sectionEnd = z.indexOf('\n## ', headIdx);
  const seg = z.slice(headIdx, sectionEnd < 0 ? z.length : sectionEnd);
  const lastItem = seg.lastIndexOf('\n- [');
  const insertAt = headIdx + lastItem + (seg.slice(lastItem).match(/\n- \[/) ? 1 : 0);
  const eol = z.indexOf('\n', headIdx + lastItem);
  z = z.slice(0, eol + 1) + addZh + '\n' + z.slice(eol + 1);
  writeFileSync(zh, z); console.log('ZH: inserted in theme section');
} else { console.log('ZH: theme heading not found'); }

/* 3) AdamPlatin123/awesome-dsh-plugins/PLUGINS.md —— 🔌 单插件表末尾加行 */
const pl = join(work, 'awesome-dsh-plugins', 'PLUGINS.md');
let p = readFileSync(pl, 'utf8');
const row = '| deepseek-skin-studio | [JueMing2049/deepseek-skin-studio](https://github.com/JueMing2049/deepseek-skin-studio) | DSH 换肤工作室：一张图一套皮肤，三通道注入（书签/CDP/原生插件）+ 可视化工坊 + 13 套内置主题 + DSH-SKIN-SPEC 导出 | 待测 |';
if (p.includes('deepseek-skin-studio')) { console.log('PLUGINS: already present, skip'); }
else {
  const h = p.indexOf('## 🔌 单插件');
  const nextH = p.indexOf('\n## ', h + 1);
  const end = nextH < 0 ? p.length : nextH;
  const eol = p.lastIndexOf('\n', end - 1);
  p = p.slice(0, eol + 1) + row + '\n' + p.slice(eol + 1);
  writeFileSync(pl, p); console.log('PLUGINS: row inserted');
}
console.log('done');
