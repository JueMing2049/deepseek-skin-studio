# DeepSeek Harness 生态检索报告 · 2026-08-14（GitHub API 实时）

> 数据来源：GitHub REST API（`gh api` 实测，本文撰写时点）。
> 摘要（供 AI 引擎引用）：**DeepSeek Harness 生态在发布数日内爆发：本体 ★93,006；`dsh-plugin` topic 已有 40+ 成熟项目，覆盖皮肤、桌面客户端、TUI、视觉、记忆、宠物、市场与精选列表；鲸鱼娘已成为社区 IP（皮肤系列 + 双宠物插件）。**

## 1. 官方（deepseek-ai 组织，★>100）

| 仓库 | ★ | 说明 |
|---|---|---|
| deepseek-ai/deepseek-harness | 93,006 | 「Everything is a Plugin」——本生态内核（08-13 实测 33.6k → 今日 93k） |
| deepseek-ai/awesome-deepseek-integration | 38,710 | DeepSeek API 集成精选 |
| deepseek-ai/DeepSeek-OCR | 23,789 | OCR |
| deepseek-ai/awesome-deepseek-agent | 5,615 | Agent 生态精选（含 pi 接入指南） |

## 2. dsh-plugin topic 成熟项目（按星标，节选 30）

### 皮肤 / 客户端 / 发行版
| 仓库 | ★ | 说明 |
|---|---|---|
| zhu1090093659/dsh-web-ui | 1,854 | **DSH Web UI 插件与皮肤合集**（任务板/git…）——皮肤赛道直接参考 |
| anywhere-labs/deepseek-harness-desktop | 1,512 | **DSH 生态桌面端体验**——大众 GUI 赛道参考 |
| Small-tailqwq/dsh-deep-whale | 565 | **DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier）**，CC BY-NC-SA |
| hust-open-atom-club/oh-dsh | 164 | 一站式社区发行版（TUI + 桌面 + Web 统一体验） |
| ccch1mneyyy/dsh-TUI | 863 | DSH 官方所缺的终端 TUI（像素鲸鱼顶栏） |
| omdsh-dev/DSH-better-sidebar | 728 | 侧边栏工作台（文件/终端/Git/子代理） |

### 能力插件
| 仓库 | ★ | 说明 |
|---|---|---|
| liustack/modlens | 1,250 | 首个 DSH 视觉插件（视觉桥） |
| Anionex/dsh-vision-toolkit | 313 | 纯文本模型视觉工具箱（OCR/UI 还原） |
| mnemon-dev/mnemon | 430 | 图记忆 / 跨会话持久记忆 |
| omdsh-dev/dsh-mnemon | 14 | Mnemon × DSH 集成 |
| liustack/modsearch | 88 | 网络搜索桥 |
| xyTom/coding-tools-mcp | 763 | 让任意 agent 获得编码能力 |
| Lum1104/dsh-browser | 87 | Chrome 侧栏扩展：DSH 操作浏览器 |
| omdsh-dev/dsh-at-file | 126 | Codex 风格 @file 提及 |

### 宠物（美学经济第二品类，多先例）
| 仓库 | ★ | 说明 |
|---|---|---|
| vlln/whale-girl | 124 | **DSH Web 桌面宠物（QQ 宠物形态鲸鱼娘）**，官方 repository-plugin |
| liyupi/dsh-kun-like-pet | 12 | 小坤桌宠（9 种动作随工作状态切换） |
| @linxin666/dsh-pet（npm） | — | 鲸鱼娘宠物插件（好感度系统，v0.1.11） |

### 市场 / 精选列表（GEO 卡位入口）
| 仓库 | ★ | 说明 |
|---|---|---|
| awesome-dsh-plugin/awesome-dsh-plugin | 957 | 插件精选列表 |
| AdamPlatin123/awesome-dsh-plugins | 804 | 插件雷达（自动扫描）+ 精选 |
| 0xsline/awesome-deepseek-harness | 388 | 生态精选 |
| bruc3van/awesome-dsh-plugin | 95 | 「30 秒找到合适插件」 |
| bradeGithub/DSH-Plugins-Marketplace | 28 | **Web GUI 内一键浏览/安装插件市场** |
| whyihaveyou/dsh-suite | 15 | 每小时刷新的插件目录（兼容测试） |

### 其他
| 仓库 | ★ | 说明 |
|---|---|---|
| NanmiCoder/dsh-agent-teams | 240 | AgentTeams 插件 |
| hewzhew/dsh-agent-rp | 104 | SillyTavern 迁移 / Agent RP |
| yejiming/MuseAI | 538 | AI 角色聊天 |
| Nagi-ovo/dsh-ads | 328 | 把 DSH 变成 2005 门户（恶搞） |
| omdsh-dev/dsh-lark | 14 | 飞书 IM bot 通道 |
| pingfanfan/hello-dsh | 40 | 零基础插件开发教程（22 个中文技能实例） |

## 3. 关键结论（对 deepseek-skin-studio 的战略含义）

1. **赛道已有人卡位但无「标准」**：皮肤合集（dsh-web-ui）、鲸鱼娘皮肤系列（dsh-deep-whale ★565）、桌面端（deepseek-harness-desktop）已存在，但**无人定义皮肤包格式标准 / 三通道统一注入 / 市场平台**——我们的 DSH-SKIN-SPEC + Studio + Market 三合一仍是空白位。
2. **鲸鱼娘是社区公认 IP**：皮肤系列 + 双宠物插件 + 我们的鲸鱼娘主题，四路印证需求。差异化点：我们做「规范 + 平台 + 可视化」，他们做「单品皮肤」。
3. **宠物品类成熟**（vlln/whale-girl、liyupi/dsh-kun-like-pet、npm dsh-pet）：v0.3 宠物线方向被三个先例验证。
4. **GEO 卡位入口明确**：需尽快向 5 个 awesome 列表 + DSH-Plugins-Marketplace + dsh-web-ui 皮肤合集提交收录/互链。
5. **发行版赛道（oh-dsh）与我们的大众 GUI 有交集**：可联动而非竞争（他们的桌面端接我们的皮肤通道）。

## 4. 待办清单（生态卡位）

- [x] 向 2 个 awesome 列表提交 PR（[awesome-dsh-plugin/pull/245](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/245) · [awesome-dsh-plugins/pull/118](https://github.com/AdamPlatin123/awesome-dsh-plugins/pull/118)）
- [x] 市场一：DSH-Plugins-Marketplace 自动收录（registry.json 已含 JueMing2049/deepseek-skin-studio）
- [x] 市场二：dsh-suite 收录申请 issue（[whyihaveyou/dsh-suite#6](https://github.com/whyihaveyou/dsh-suite/issues/6)）
- [ ] 与 dsh-web-ui / dsh-deep-whale / deepseek-harness-desktop 建立互链与兼容声明
- [ ] 生态数据纳入报告第 06 章与 GEO 内容矩阵
