# CertTrust Inspector

**浏览器证书安全检测 · Browser Certificate Security Check · ブラウザー証明書チェック**

[在线检测 / Live Site / Webサイト](https://fanginjapan.github.io/CertTrust-Inspector/) · [问题反馈 / Issues](https://github.com/FangInJapan/CertTrust-Inspector/issues)

简体中文 | [日本語](#日本語) | [English](#english)

## 简体中文

CertTrust Inspector 是一款无需安装的浏览器证书连接检测工具。它针对 2026 年 eMudhra 证书事件中的 12 个 TLS 测试端点，帮助用户了解当前浏览器是否仍能连接这些测试站点，并提供通俗的结果说明和设备更新建议。

本工具面向普通用户，免费使用，无须注册。

### 主要功能

- **12 项连接检测**：检查 eMudhra 相关测试端点，并显示参考站的可达性。
- **直观的结果展示**：环形统计图、实时检测进度和各证书链的详细结果。
- **解决方法指导**：提供 Windows、macOS、iOS/iPadOS、Android 和 Linux 的常用更新及复测步骤。
- **AI 求助提示词**：完成检测后，可在本地生成包含完整 JSON 检测结果的提问模板，供用户检查、编辑和自行复制给 AI 助手。
- **报告导出**：支持下载 JSON 报告，以及通过浏览器打印或保存为 PDF。
- **多语言与自适应界面**：支持简体中文、日语、英语，适配电脑和手机，可切换浅色或深色主题。

### 如何使用

1. 打开 **[CertTrust Inspector](https://fanginjapan.github.io/CertTrust-Inspector/)**。
2. 点击“开始检测”，浏览器会向第三方参考站点发送 HTTPS 请求。
3. 查看检测结果分布和 12 项详细记录。
4. 如果发现“风险连通”，优先更新操作系统和浏览器，随后再次检测，并使用[原始检测网站](https://emudhra.we-have-a-problem.com/#check)交叉核对。
5. 需要进一步帮助时，可选择设备系统，使用页面内的修复指南，或生成 AI 求助提示词。

### 如何理解检测结果

| 检测状态 | 含义 |
| --- | --- |
| **风险连通（红色）** | 浏览器成功完成了对应测试站点的请求，应更新并进一步排查。 |
| **未能连通（绿色）** | 请求未成功完成；可能由证书拒绝、网络问题、DNS 或其他原因引起，**不代表已确认安全**。 |
| **超时 / 待确认（黄色）** | 请求在限定时间内没有完成，原因尚不明确。 |
| **参考站不可达** | 无法充分确认当前测试环境，应检查网络或稍后重试。 |

**重要：这是一项浏览器连接测试，并非完整的 TLS 证书验证或设备安全扫描。** 浏览器中的 JavaScript 通常无法区分证书吊销、DNS 故障、代理拦截或其他请求失败原因。因此，“12 项均未连通”不能证明整台设备绝对安全，也不能用于判断是否曾发生账号泄露。

### 隐私说明

- 检测结果仅在当前网页的运行内存中处理，网站不接收或保存个人检测报告。
- AI 求助提示词在浏览器内生成，**不会自动上传到任何 AI 服务**；只有用户主动复制并发送时，内容才会交给对应服务。
- 语言和主题偏好可能保存在浏览器本地。
- 本站不集成第三方流量统计。不过，GitHub Pages 和被访问的外部测试站点仍可能记录常规网络访问日志，例如 IP 地址和请求信息。

### 本地运行

本项目采用原生 HTML、CSS 与 JavaScript，无须安装依赖或配置服务器端数据库。下载代码后，可在项目根目录执行：

~~~bash
python -m http.server 8000
~~~

然后在浏览器访问 http://localhost:8000/ 。

在线版本通过 GitHub Pages 提供。

### 参考资料

- [eMudhra 原始检测站](https://emudhra.we-have-a-problem.com/#check)
- [Mozilla 相关安全事件记录](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449)
- [Goldppx / Certificate-Health-Code](https://github.com/Goldppx/Certificate-Health-Code) — 检测思路与交互形式的参考项目；CertTrust Inspector 的网站代码独立实现。

**源码使用说明**：本仓库当前未附开源许可证。公开可查看代码并不自动授予复制、修改或再分发的许可。

---

## 日本語

CertTrust Inspector は、eMudhra の証明書問題に関連する 12 の TLS テスト先について、現在のブラウザーから接続できるかを調べる無料のWebツールです。インストールやアカウント登録は必要ありません。

**主な機能**：検査状況を示す円グラフ、証明書チェーン別の結果、OS別の更新手順、JSON/PDF形式のレポート、AIに相談するための文章作成、中国語・日本語・英語の表示切り替え。

**使い方**： [検査ページ](https://fanginjapan.github.io/CertTrust-Inspector/)で「検査を開始」を押し、表示された結果を確認してください。リスクのある接続が見つかった場合は、OSとブラウザーを更新し、[元の検査サイト](https://emudhra.we-have-a-problem.com/#check)でも確認してください。

**注意事項**：「接続不可」は、証明書が拒否されたことを証明しません。DNSやネットワークの問題でも同様の結果になります。このツールだけで端末全体の安全性は判断できません。

**プライバシー**：検査結果はブラウザー内で処理され、AIへ自動送信されません。外部テスト先やGitHub Pagesには通常のアクセスログが残る可能性があります。

---

## English

CertTrust Inspector is a free, installation-free browser connection checker for 12 TLS endpoints associated with the eMudhra certificate incident. It explains the results in plain language and provides practical update guidance.

**Features:** Live result chart, per-endpoint details, OS-specific remediation guidance, JSON report export, print-to-PDF support, locally generated AI troubleshooting prompts, and Chinese/Japanese/English interfaces.

**How to use:** Open the [live checker](https://fanginjapan.github.io/CertTrust-Inspector/), start a check, and review the findings. If any risk endpoint connects, update your OS and browser and cross-check at the [original test site](https://emudhra.we-have-a-problem.com/#check).

**Limitations:** A failed browser request does **not** prove certificate rejection. DNS, proxy, network errors, and certificate validation failures may produce similar results. This tool is not a complete device security scanner.

**Privacy:** Results stay in page memory unless you choose to export them. AI prompts are generated locally and are never sent automatically. External test endpoints and GitHub Pages may still log ordinary connection metadata.

**Source availability:** No open-source license is currently provided. Public access to the repository does not by itself grant reuse or redistribution rights.
