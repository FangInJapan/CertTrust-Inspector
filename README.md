# CertTrust Inspector / 证书安全检测中心

[简体中文](#简体中文) · [日本語](#日本語) · [English](#english)

## 简体中文

针对 eMudhra 证书事件的轻量级、隐私优先浏览器连接检测页面，使用**原生 HTML / CSS / JavaScript**独立实现，无需构建系统或第三方前端依赖。

### 功能
- 用户主动启动的 12 个 eMudhra TLS 测试端点连接测试
- 参考网站连通性探测、进度及逐项结果
- 简体中文 / 日语 / 英语
- 响应式布局与深浅主题
- Windows、macOS、iOS/iPadOS、Android、Linux 更新与复核建议
- JSON 报告导出和打印 / 保存 PDF
- 检测结果仅保留在页面内存；语言及主题使用本地浏览器存储；无第三方分析脚本

### 关键安全边界

**这是浏览器连接性测试，不是完整的证书链验证器。**

网页使用 no-cors fetch 向独立的风险测试域名请求。若请求完成，代表当前浏览器能完成相应连接（需要进一步排查）。若请求失败，浏览器不会提供详细 TLS 错误：证书吊销、DNS、网络阻断、代理、内容拦截和扩展均可能导致类似结果。因此项目**不会把“未能连通”自动解释为“已证实安全”**，也不会声称能够检测电脑上所有程序或历史感染情况。

此检查依赖 [eMudhra 测试站](https://emudhra.we-have-a-problem.com/#check)。如果站点下线或环境发生变化，检查结果可能失去意义。用户应该优先安装官方系统/浏览器更新、使用原始检测站交叉核对；不要禁用证书检查或直接运行未经核实的管理脚本。

**隐私**：页面不上传或持久化保存检测报告，也不集成流量统计。启动检测后，浏览器会访问第三方测试域名；该站与 GitHub Pages 主机仍可保留常规 IP、请求头等日志。浏览器可保存语言/主题偏好。

### 部署到 GitHub Pages

1. 打开仓库 **Settings → Pages**
2. 在 **Build and deployment** 下选择 **Deploy from a branch**
3. Branch 选择 **main**，目录 **/(root)**，点击 **Save**
4. 等待 GitHub Pages 部署完成后访问：<https://fanginjapan.github.io/CertTrust-Inspector/>

无需 secrets、token 或工作流。也可以本地运行：在仓库目录执行 \`python -m http.server 8000\`，打开 <http://localhost:8000/>。

### 项目结构

\`\`\`text
index.html
assets/
  style.css
  favicon.svg
src/
  app.js
  i18n.js
.nojekyll
README.md
\`\`\`

### 测试建议

在 Chrome、Edge、Firefox 和 Safari 的桌面及手机版本检查：排版、语言切换、主题、手动开始测试、超时、参考站不可达、结果导出和打印。特别要用模拟失败或隔离网络的方式验证：失败时**不能**显示“已确认安全”。目前尚未声称完成跨浏览器端到端测试。

### 参考与归属

- [原始检测站](https://emudhra.we-have-a-problem.com/#check)
- [Goldppx / Certificate-Health-Code](https://github.com/Goldppx/Certificate-Health-Code) — 概念与用户体验参考。本站为独立实现，并非直接复制原代码。
- [Mozilla security issue](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449)

本仓库暂无许可证；未经作者授权的第三方复用不自动获准。发布前可根据维护者意愿选择并添加适当许可证。参照项目没有明确的全仓库许可证，因此请勿直接复制其源码。

## 日本語

eMudhraの証明書問題について、現在のブラウザーとネットワークからリスクのある12個のテストサイトへの接続状況を確認する静的Webアプリです。中国語・日本語・英語に対応しています。

**注意**：ブラウザーのJavaScriptでは証明書エラーとDNS/ネットワーク障害を区別できません。「接続不可」は安全を証明するものではありません。OSとブラウザーを更新し、必要に応じて元のテストサイトで確認してください。

GitHub Pages: Settings → Pages → Deploy from a branch → main / (root).

## English

A static, privacy-first browser connection checker for 12 eMudhra affected TLS test endpoints, with Chinese/Japanese/English UI, OS-specific guidance, and local report export.

**Important**: A failed fetch cannot distinguish TLS rejection from DNS, proxy, or network errors. No successful connection must **not** be interpreted as proof that a device is safe. Install official updates and cross-check with the [original test](https://emudhra.we-have-a-problem.com/#check).

Deploy via GitHub Pages → Settings → Pages → Deploy from a branch → main / (root).
