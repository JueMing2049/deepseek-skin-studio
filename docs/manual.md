# 完整手册 · DeepSeek Skin Studio

## 1. 它是什么

给 DeepSeek Harness Web UI（默认 `http://127.0.0.1:3080`）换肤的社区工具。三条注入通道（书签 / CDP / 原生插件）+ 一个可视化工坊 + 12 套内置主题。

## 2. 通道选择

| 通道 | 适合 | 持久性 | 依赖 |
|---|---|---|---|
| 书签 / 控制台 | 一次体验、无权限装浏览器插件 | 刷新即消失 | 无 |
| CDP | 日常使用、需要 🎨 主题菜单 | 浏览器重启后需重跑 | Node ≥ 22 |
| 原生插件（DSH-SKIN-SPEC + skin-loader） | 长期使用、卸载即还原 | 持久（随插件） | DSH client 插件体系 |

## 3. 安装与使用

### 3.1 书签通道

```bash
node src/cli.mjs snippet --theme galaxy-deep
```

- 控制台版：复制输出粘贴到 DSH 页面的 DevTools Console 回车。
- 书签版：新建书签，地址粘贴 `javascript:...` 整行；打开 DSH 页面后点击书签。

### 3.2 CDP 通道

```bash
# macOS / Linux
./scripts/apply.command galaxy-deep

# Windows
.\scripts\apply.ps1 -Theme galaxy-deep
```

脚本会以 `--remote-debugging-port=9331` 拉起 Chrome/Edge 并打开 DSH，然后注入主题与右上角 🎨 菜单。

### 3.3 原生插件通道

```bash
node src/cli.mjs export-spec --theme galaxy-deep --out skin.galaxy-deep
```

按 DSH-SKIN-SPEC v0.1 导出标准皮肤包，配合 skin-loader client 插件装载（卸载即还原）。

## 4. 可视化工坊

双击 `studio/index.html`：

- 左侧选内置主题，或上传图片自动取色（主色 = 高饱和像素簇均值；面板 = 最亮 20% 像素均值；背景 = 最暗 20% 像素均值；文字色按面板明度自动深浅）。
- 右侧 12 项调色板逐一微调。
- 顶部导出 `theme.json` / `theme.css`（DSH-SKIN-SPEC）/ 皮肤包 manifest。

## 5. 主题格式

见 README「极简主题格式」。`surface` 明度 > 140 判定为浅色主题。

## 6. 安全边界

- 只注入 `<style>` 与主题菜单 DOM，不修改 DSH 安装目录、配置与签名。
- CDP 只连本机回环 `127.0.0.1`；皮肤包校验（export-spec 的规范校验、未来的市场签名）在装载前执行。
- 社区投稿主题的素材权利由投稿者声明；权利存疑素材不进公开包（参照 DreamSkin 审核实践）。

## 7. 故障排查

| 现象 | 处理 |
|---|---|
| `apply` 报「未找到可注入的浏览器页面」 | 确认 DSH Web UI 已在浏览器打开；确认浏览器由脚本以 `--remote-debugging-port=9331` 启动（脚本自动拉起时等待 4 秒可适当加长） |
| Node 版本报错 | CLI 需要 Node ≥ 22；书签/工坊不受影响 |
| `doctor` 显示 DSH 未检测到 | 先运行 `npx @deepseek-ai/dsh web` |
| 刷新后皮肤消失 | 属预期（浏览器通道天性）；重跑 apply 或改走原生插件通道 |
| 想回到官方外观 | 🎨 菜单「原生界面」或 `node src/cli.mjs pause` |

## 8. FAQ

- **和官方什么关系？** 社区项目，非 DeepSeek 官方。
- **会动我的数据吗？** 不会。只改外观。
- **皮肤能上架吗？** v0.2 主题库 Gallery 上线后即可投稿（人工审核 + SHA-256 签名）。
