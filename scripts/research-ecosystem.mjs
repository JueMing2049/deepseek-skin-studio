const TOKEN = process.env.GH_TOKEN;
const H = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'dsh-research' };
async function get(url) {
  const r = await fetch('https://api.github.com' + url, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
const fmt = r => `${r.full_name}  ★${r.stargazers_count}  ${r.language || '-'}  ${(r.description || '').slice(0, 78)}`;
const out = [];
out.push('===== [1] deepseek-ai 官方组织（★>100） =====');
const org = await get('/orgs/deepseek-ai/repos?per_page=100&sort=stars&order=desc');
org.filter(r => r.stargazers_count > 100).forEach(r => out.push(fmt(r)));

out.push('\n===== [2] topic:dsh-plugin（按星标） =====');
const tp = await get('/search/repositories?q=topic:dsh-plugin&sort=stars&order=desc&per_page=40');
tp.items.forEach(r => out.push(fmt(r)));

out.push('\n===== [3] topic:dsh（按星标） =====');
const td = await get('/search/repositories?q=topic:dsh&sort=stars&order=desc&per_page=30');
td.items.forEach(r => out.push(fmt(r)));

out.push('\n===== [4] 名称/描述含 deepseek-harness（★>50，成熟插件/客户端） =====');
const q = await get('/search/repositories?q=deepseek-harness+in:name,description,readme&sort=stars&order=desc&per_page=40');
q.items.filter(r => r.stargazers_count > 50).forEach(r => out.push(fmt(r)));

out.push('\n===== [5] topic:cordis（按星标） =====');
const tc = await get('/search/repositories?q=topic:cordis&sort=stars&order=desc&per_page=20');
tc.items.forEach(r => out.push(fmt(r)));

console.log(out.join('\n'));
