const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const cron = require("node-cron");

// 生成 README 内容
function generateReadme(linkUrl) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  return `# 🌐 CloudNices FreeVPN

Your go-to source for **daily updated free VPN subscription nodes**, comprehensive **VPN provider reviews**, and step-by-step **setup guides** for popular clients like **V2Ray**, **Clash**, and more.

Stay secure, private, and unrestricted online with our trusted and verified VPN resources — updated automatically every day.

---

# ☁️ CloudNices 免费VPN

你的首选资源，提供**每日更新的免费VPN订阅节点**、详尽的**VPN服务评测**，以及适用于 **V2Ray、Clash** 等客户端的**安装与使用指南**。

内容每日自动更新，帮助你保持在线安全、隐私和自由访问互联网。

---

## 🔗 Latest Free V2Ray Subscription (最新免费 V2Ray 订阅)

Get the most recent and reliable V2Ray subscription link for high-speed, secure browsing across global nodes.

获取最新稳定的 V2Ray 免费订阅链接，享受高速、安全的网络连接：

- 👉 [\`${linkUrl}\`](${linkUrl})

> 📅 Updated: **${dateStr}**

---

## 📚 Features | 功能亮点

- ✅ **Daily Updated Nodes** - Always fresh and active VPN subscription links  
- ✅ **Supports V2Ray, Clash, Shadowrocket** - Compatible with major VPN clients  
- ✅ **Beginner Friendly** - One-click import, plus setup guides  
- ✅ **Global Servers** - US, SG, CA, HK, Europe, and more  
- ✅ **SEO-Optimized Blog Integration** - Auto-publish via Astro blog

---

## 🤖 Automation

- Runs daily at **6:00 AM**
- Automatically commits and pushes to this repository

---

## 📄 License

This project is licensed under the MIT License.  
请根据所在地区合法合规使用 VPN 工具和服务。
`;
}

// 主流程
function updateReadmeAndPush() {
  const projectRoot = path.resolve(__dirname, "../../"); // => cloudnices-freevpn/
  const gitmdPath = path.resolve(projectRoot, "./freevpn/gitmd.text"); // 跨目录
  const readmePath = path.join(projectRoot, "README.md");

  console.log(gitmdPath)

  if (!fs.existsSync(gitmdPath)) {
    console.error("❌ gitmd.text not found!");
    return;
  }

  const link = fs.readFileSync(gitmdPath, "utf-8").trim();
  if (!/^https?:\/\/.+/.test(link)) {
    console.error("❌ Invalid link format in gitmd.text!");
    return;
  }

  const content = generateReadme(link);

  // 🧱 确保 README.md 所在目录存在
  fs.mkdirSync(path.dirname(readmePath), { recursive: true });

  fs.writeFileSync(readmePath, content, "utf-8");
  console.log("✅ README.md generated at cloudnices-freevpn/README.md");

  // Git 提交
  try {
    execSync("git add .", { cwd: projectRoot, stdio: "inherit" });
    execSync('git commit -m "📘 Daily update README with latest VPN link"', {
      cwd: projectRoot,
      stdio: "inherit",
    });
    execSync("git push", { cwd: projectRoot, stdio: "inherit" });
    console.log("🚀 Git push completed.");
  } catch (err) {
    console.error("❌ Git push failed:", err.message);
  }
}

// ⏰ 每天早上 6:00 自动运行
cron.schedule("0 6 * * *", () => {
  console.log("⏰ Scheduled run at 6:00 AM");
  updateReadmeAndPush();
});

// 手动执行一次（首次测试）
if (require.main === module) {
  updateReadmeAndPush();
}
