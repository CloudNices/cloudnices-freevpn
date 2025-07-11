const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const cron = require("node-cron");

// 获取订阅链接
const toDate = new Date().toISOString().slice(0, 10);
const gitmdPath = path.resolve(__dirname, "../../freevpn/gitmd.text");
const readmePath = path.resolve(__dirname, "../README.md");

// 生成 README 内容
function generateReadme(link) {
  return `# 🌐 CloudNices FreeVPN

Your go-to source for **daily updated free VPN subscription nodes**, comprehensive **VPN provider reviews**, and step-by-step **setup guides** for popular clients like **V2Ray**, **Clash**, and more.

Stay secure, private, and unrestricted online with our trusted and verified VPN resources — updated automatically every day.

---

# ☁️ CloudNices 免费VPN

你的首选资源，提供**每日更新的免费VPN订阅节点**、详尽的**VPN服务评测**，以及适用于 **V2Ray、Clash** 等客户端的**安装与使用指南**。

内容每日自动更新，帮助你保持在线安全、隐私和自由访问互联网。

---

## 🔗 Latest Free V2Ray Subscription (最新免费 V2Ray 订阅)

获取最新稳定的 V2Ray 免费订阅链接，享受高速、安全的网络连接：

👉 [${link}](${link})

> 📅 Updated: **${toDate}**

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

// 自动生成并提交
async function updateReadmeAndPush() {
  try {
    if (!fs.existsSync(gitmdPath)) {
      console.error("❌ 未找到 gitmd.text 文件:", gitmdPath);
      return;
    }

    const link = fs.readFileSync(gitmdPath, "utf-8").trim();
    const content = generateReadme(link);
    fs.writeFileSync(readmePath, content, "utf-8");

    console.log("✅ README.md generated at", readmePath);

    // Git 提交并推送
    execSync("git add README.md", { cwd: path.resolve(__dirname, "..") });
    execSync(`git commit -m "🔄 Update README with ${toDate} subscription link"`, {
      cwd: path.resolve(__dirname, ".."),
    });
    execSync("git push", { cwd: path.resolve(__dirname, "..") });

    console.log("✅ Pushed to GitHub");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// 手动执行
if (require.main === module) {
//   updateReadmeAndPush();
}

const task = cron.schedule("27 14 * * *", async () => {
  console.log("🕑 Scheduled job triggered at 14:21 (2:21 PM)");
  updateReadmeAndPush();
}, {
  timezone: "Asia/Shanghai"
});
