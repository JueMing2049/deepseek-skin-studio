# SKILL.md — 给 AI 助手的自动化安装流程

> 如果用户把本仓库地址发给你并说「用这个开源项目帮我给 DeepSeek Harness 换主题」，请按本文件自动执行，无需人类逐步操作。目标：DeepSeek Harness Web UI（默认 `http://127.0.0.1:3080`）。

## 0. 前置确认

1. 确认用户已运行 DeepSeek Harness Web UI：请求 `http://127.0.0.1:3080`，非 200 则提示用户先启动 DSH（`npx @deepseek-ai/dsh web`）。
2. 确认 Node.js ≥ 22：`node -v`。不足则提示升级。

## 1. 获取仓库

```bash
git clone https://github.com/MetaSkin/deepseek-skin-studio.git
cd deepseek-skin-studio
```

## 2. 平台检测与注入

### 有 CLI 权限（推荐）

```bash
node src/cli.mjs doctor                          # 自检
node src/cli.mjs list                            # 列出主题
node src/cli.mjs apply --theme galaxy-deep       # 注入（会以调试模式拉起 Chrome/Edge 并打开 DSH）
node src/cli.mjs status                          # 验证：应显示 injected=true
```

`apply` 找不到 DSH 标签页时：确认 DSH Web UI 已在浏览器打开，且浏览器由脚本以 `--remote-debugging-port=9331` 启动；否则改用书签通道。

### 书签通道（无 CLI 权限）

```bash
node src/cli.mjs snippet --theme galaxy-deep
```

把输出的整段代码交给用户：粘贴到浏览器地址栏（或存为书签后点击），在 DSH 页面上执行即换肤。

## 3. 指定主题

用户说「用深色原神主题」等时，先 `node src/cli.mjs list` 核对主题 id 再注入；自定义主题先走可视化工坊 `studio/index.html`（上传图片自动取色 → 导出 theme.json → `node src/cli.mjs create` 或直接 `--theme` 指向导出文件）。

## 4. 验证与还原

- 验证：`node src/cli.mjs status` 输出 `injected=true`，并请用户在浏览器确认右上角出现 🎨 按钮。
- 还原：`node src/cli.mjs pause`（CDP 通道）或书签通道刷新页面即还原；原生通道卸载 skin-loader 插件即还原。

## 5. 边界

- 只注入样式与主题菜单，绝不修改 DSH 的安装目录、配置与签名。
- 只允许本机回环端口（127.0.0.1）；不向任何外部地址发送主题数据。
- 失败时如实报告，不编造「已换肤」。
