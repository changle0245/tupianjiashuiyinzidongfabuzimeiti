# 图片加水印自动发布自媒体平台

> 一个强大的Web应用，支持批量为图片添加水印，并自动发布到多个社交媒体平台

## 🎯 项目愿景

帮助内容创作者高效管理图片水印和多平台发布，节省时间，提高效率。

## ✨ 核心功能

### 📸 图片处理
- ✅ 批量上传图片
- ✅ 智能裁剪
- ✅ AI图片增强（模糊变高清）
- ✅ 实时预览

### 💧 水印功能
- ✅ **文字水印**：自定义内容、字体、颜色、透明度
- ✅ **图片水印**：上传LOGO，自由调整
- ✅ **拖拽定位**：鼠标拖动，精准放置
- ✅ **大小调整**：自由缩放水印尺寸
- ✅ **批量处理**：一键应用到所有图片

### 🤖 AI助手
- 🎯 AI生成发布标题
- 📝 AI生成详细描述
- 🖼️ AI图片质量增强

### 🚀 自动发布
- 📱 **支持平台**：
  - 微信视频号
  - YouTube
  - Facebook
  - Instagram
  - TikTok
  - X (Twitter)
  - 小红书
- ⏰ **定时发布**：设置发布时间，自动执行
- 📋 **智能分发**：
  - 支持API的平台→自动发布
  - 不支持的平台→保存草稿
- 📊 发布状态实时监控

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化UI框架
- **Next.js 14** - 全栈React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 快速样式开发
- **Fabric.js** - Canvas图片编辑

### 后端
- **Next.js API Routes** - 服务端API
- **Sharp** - 高性能图片处理
- **Bull Queue** - 任务队列系统
- **node-cron** - 定时任务

### AI & 第三方服务
- **OpenAI GPT-4** - 内容生成
- **Real-ESRGAN / Replicate** - 图片增强
- **社交媒体APIs** - 多平台发布

### 数据存储（商业化阶段）
- **PostgreSQL** - 用户数据
- **Prisma** - ORM
- **AWS S3 / 阿里云OSS** - 图片存储
- **Redis** - 缓存和队列

## 📋 开发路线图

### ✅ MVP阶段（无数据库）

#### 第一阶段：核心图片处理（2-3周）
- [ ] 图片上传和预览
- [ ] 水印编辑器（拖拽、调整）
- [ ] 图片裁剪
- [ ] 批量处理

#### 第二阶段：AI功能（2-3周）
- [ ] AI生成标题/描述
- [ ] AI图片增强

#### 第三阶段：定时发布（2周）
- [ ] 发布队列系统
- [ ] 定时任务调度
- [ ] 状态管理

#### 第四阶段：平台集成（3-4周）
- [ ] YouTube API
- [ ] Twitter API
- [ ] Facebook/Instagram API
- [ ] TikTok API
- [ ] 微信视频号API
- [ ] 小红书（第三方服务）

### 🚀 商业化阶段

#### 第五阶段：用户系统
- [ ] 用户注册/登录
- [ ] 数据库集成
- [ ] 云存储迁移

#### 第六阶段：订阅付费
- [ ] Stripe集成
- [ ] 订阅计划管理
- [ ] 使用量统计

## 💰 商业模式

| 计划 | 价格 | 发布次数 | 功能 |
|------|------|----------|------|
| 免费版 | $0 | 10次/月 | 基础功能 |
| 基础版 | $9.99/月 | 100次/月 | + AI增强 |
| 专业版 | $29.99/月 | 500次/月 | + 高级AI |
| 企业版 | $99.99/月 | 无限 | + API接入 |

## 🚦 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/tupianjiashuiyinzidongfabuzimeiti.git
cd tupianjiashuiyinzidongfabuzimeiti

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入API密钥

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器
# 访问 http://localhost:3000
```

### 环境变量配置

创建 `.env.local` 文件：

```bash
# AI服务
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_TOKEN=your_replicate_token

# YouTube
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Facebook/Instagram
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Twitter
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# TikTok
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# 微信
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

## 📁 项目结构

```
src/
├── app/                    # Next.js页面
│   ├── page.tsx           # 首页
│   ├── editor/            # 水印编辑器
│   ├── publish/           # 发布管理
│   └── api/               # API路由
├── components/            # React组件
│   ├── ImageUploader.tsx
│   ├── WatermarkEditor.tsx
│   └── PublishForm.tsx
├── lib/                   # 工具库
│   ├── image-processor.ts
│   ├── ai-service.ts
│   └── platforms/         # 平台适配器
└── types/                 # TypeScript类型
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请提交Issue或联系我们。

---

**立即开始，让内容发布更高效！** 🎉
