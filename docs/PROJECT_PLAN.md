# 图片加水印自动发布自媒体平台 - 项目规划

## 项目概述

一个Web应用，支持批量为图片添加水印（文字/图片），并自动发布到多个社交媒体平台。具有AI辅助功能，可生成标题、描述，并增强图片清晰度。

### 商业模式
- MVP阶段：免费使用，无数据库
- 正式上线：订阅付费制，提供用户数据存储和高级功能

---

## 目标平台

- ✅ 微信视频号
- ✅ YouTube (ytb)
- ✅ Facebook (fb)
- ✅ Instagram (ins)
- ✅ TikTok (tk)
- ✅ X (Twitter)
- ✅ 小红书

---

## 核心功能

### 1. 图片管理
- [x] 批量上传图片
- [x] 图片预览和管理
- [x] 图片裁剪编辑
- [x] AI图片增强（模糊变高清）

### 2. 水印功能
- [x] 文字水印
  - 可自定义内容、字体、颜色、透明度
  - 可拖动位置
  - 可调整大小
- [x] 图片水印
  - 上传LOGO/图片
  - 可拖动位置
  - 可调整大小和透明度
- [x] 批量应用水印设置

### 3. AI功能
- [x] AI生成发布标题
- [x] AI生成详细描述
- [x] AI图片质量增强（去模糊、超分辨率）

### 4. 发布管理
- [x] 多平台账号绑定
- [x] 定时发布设置
- [x] 自动发布（支持的平台）
- [x] 保存到草稿（不支持API的平台）
- [x] 发布队列管理
- [x] 发布状态监控

### 5. 用户系统（后期）
- [ ] 用户注册/登录
- [ ] 订阅付费系统
- [ ] 用户数据存储
- [ ] 使用量统计和限制

---

## 技术栈选择

### 前端技术
```
- React 18 + TypeScript（类型安全、易维护）
- Next.js 14（全栈框架、SEO优化、API集成）
- Tailwind CSS（快速UI开发）
- shadcn/ui（现代化UI组件库）
- React DnD（拖拽功能）
- Fabric.js / Konva.js（Canvas图片编辑）
```

**选择理由**：
- Next.js 是目前最流行的React全栈框架，简单易学
- 自带API Routes，MVP阶段不需要单独后端
- TypeScript提供类型安全，减少错误
- 社区活跃，问题容易解决

### 后端技术（MVP阶段）
```
- Next.js API Routes（与前端集成）
- Sharp（Node.js图片处理库）
- node-cron（定时任务）
- Bull Queue（任务队列）
```

### AI服务集成
```
- OpenAI GPT-4 API（生成标题和描述）
- Replicate API 或 Real-ESRGAN（图片增强）
```

### 社交媒体API
```
- YouTube Data API v3
- Meta Graph API (Facebook/Instagram)
- TikTok Content Posting API
- Twitter API v2
- 微信开放平台API
- 小红书（第三方服务或Web自动化）
```

### 数据存储

**MVP阶段**：
```
- 临时文件存储（本地/tmp）
- 无数据库
- Session存储（用户设置）
```

**商业化阶段**：
```
- PostgreSQL（用户数据、发布记录）
- Prisma ORM（类型安全的数据库访问）
- AWS S3 / 阿里云OSS（图片存储）
- Redis（缓存、队列）
```

### 支付系统（商业化阶段）
```
- Stripe（国际支付）
- 微信支付/支付宝（国内支付）
```

---

## 系统架构

### MVP架构（无数据库）
```
┌─────────────────────────────────────────┐
│          用户浏览器 (React)              │
│  - 图片上传                              │
│  - 水印编辑器（拖拽、调整）               │
│  - 发布配置                              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Next.js Server (API Routes)        │
│  - 图片处理 (Sharp)                      │
│  - AI调用 (OpenAI, Replicate)           │
│  - 社交媒体API集成                       │
│  - 定时任务队列                          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         第三方服务                       │
│  - OpenAI API                           │
│  - Real-ESRGAN (图片增强)               │
│  - YouTube API                          │
│  - Facebook/Instagram API               │
│  - TikTok API                           │
│  - Twitter API                          │
│  - 微信API                               │
│  - 小红书 (第三方服务)                   │
└─────────────────────────────────────────┘
```

### 商业化架构（含数据库）
```
┌─────────────────────────────────────────┐
│          用户浏览器 (React)              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Next.js Server + API               │
│  - 用户认证 (NextAuth.js)                │
│  - 订阅管理                              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│  PostgreSQL   │   │   Redis Cache    │
│  - 用户数据    │   │   - Session      │
│  - 发布记录    │   │   - 任务队列     │
│  - 订阅信息    │   │                  │
└───────────────┘   └──────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│         云存储 (S3/OSS)                  │
│  - 用户图片                              │
│  - 水印素材                              │
└─────────────────────────────────────────┘
```

---

## MVP开发路线图

### 第一阶段：核心图片处理（2-3周）

**目标**：实现基础的图片上传、水印添加、编辑功能

- [ ] 项目初始化（Next.js + TypeScript + Tailwind）
- [ ] 图片上传组件（拖拽上传、批量上传）
- [ ] 图片预览画廊
- [ ] Canvas水印编辑器
  - [ ] 添加文字水印（可拖动、调整大小、颜色、透明度）
  - [ ] 添加图片水印（可拖动、调整大小、透明度）
  - [ ] 实时预览
- [ ] 图片裁剪功能
- [ ] 批量应用水印设置
- [ ] 导出处理后的图片

**技术要点**：
- 使用 Fabric.js 或 Konva.js 实现Canvas编辑器
- 使用 Sharp 进行服务端图片处理
- 前端使用 react-dropzone 实现拖拽上传

### 第二阶段：AI功能集成（2-3周）

**目标**：集成AI生成标题/描述和图片增强

- [ ] 集成 OpenAI API
  - [ ] AI生成标题功能
  - [ ] AI生成描述功能
  - [ ] 支持自定义提示词
- [ ] 集成图片增强API
  - [ ] Real-ESRGAN 或 Replicate API
  - [ ] 模糊图片变高清
  - [ ] 批量增强处理
- [ ] AI功能UI界面
- [ ] 错误处理和重试机制

**技术要点**：
- OpenAI API调用（流式响应）
- 图片增强可选择：
  - Replicate API（简单，付费）
  - 自部署 Real-ESRGAN（复杂，免费）
- API密钥管理（环境变量）

### 第三阶段：定时发布系统（2周）

**目标**：实现发布队列和定时发布

- [ ] 发布配置界面
  - [ ] 选择目标平台
  - [ ] 设置发布时间
  - [ ] 输入标题、描述、标签
- [ ] 任务队列系统（Bull Queue）
- [ ] 定时任务调度（node-cron）
- [ ] 发布状态管理
  - [ ] 待发布、发布中、已发布、失败
- [ ] 简单的发布历史展示（无持久化）

**技术要点**：
- Bull Queue + Redis（或用内存队列简化MVP）
- node-cron 定时检查任务
- WebSocket 实时更新发布状态

### 第四阶段：社交媒体API集成（3-4周）

**目标**：接入各平台API，实现自动发布

**优先级排序**（按API易用性）：

1. **YouTube**（最容易）
   - [ ] OAuth2认证
   - [ ] 视频上传API（图片可做成幻灯片视频）
   - [ ] 设置标题、描述、标签

2. **Twitter/X**（容易）
   - [ ] OAuth2认证
   - [ ] Tweet with media API
   - [ ] 图片上传

3. **Facebook**（中等）
   - [ ] OAuth2认证
   - [ ] Graph API发布图片
   - [ ] Page/Profile选择

4. **Instagram**（中等）
   - [ ] 通过Facebook Graph API
   - [ ] Content Publishing API
   - [ ] 支持图片和轮播

5. **TikTok**（中等）
   - [ ] TikTok for Developers
   - [ ] Content Posting API
   - [ ] 图片转视频

6. **微信视频号**（困难）
   - [ ] 微信开放平台认证
   - [ ] 视频号API（可能需要企业认证）
   - [ ] 备用：保存到草稿，手动发布

7. **小红书**（最困难）
   - [ ] 官方API申请（如有）
   - [ ] 备用：第三方服务
   - [ ] 备用：Web自动化（Puppeteer）

**通用功能**：
- [ ] 统一的平台适配器接口
- [ ] OAuth2认证流程
- [ ] Token刷新机制
- [ ] API限流处理
- [ ] 错误重试机制
- [ ] 不支持API的平台→保存到本地草稿

### 第五阶段：用户体验优化（1-2周）

- [ ] 响应式设计（移动端适配）
- [ ] 批量操作优化
- [ ] 进度条和加载状态
- [ ] 错误提示优化
- [ ] 使用教程和帮助文档
- [ ] 性能优化

---

## 商业化阶段（第六阶段）

### 用户系统和数据库
- [ ] PostgreSQL + Prisma设置
- [ ] 用户注册/登录（NextAuth.js）
- [ ] 用户数据模型设计
- [ ] 迁移到云存储（S3/OSS）

### 订阅付费系统
- [ ] 订阅计划设计
  - 免费版：每月10次发布
  - 基础版：每月100次，$9.99/月
  - 专业版：每月500次，$29.99/月
  - 企业版：无限次，$99.99/月
- [ ] Stripe集成
- [ ] 微信支付/支付宝集成
- [ ] 订阅管理界面
- [ ] 使用量统计和限制

### 高级功能
- [ ] 团队协作功能
- [ ] 内容日历
- [ ] 数据分析和报表
- [ ] 更多AI功能
- [ ] 模板库

---

## 技术风险和解决方案

### 风险1：社交媒体API限制
**问题**：部分平台API不对个人开发者开放，或需要企业认证

**解决方案**：
- 优先接入开放API（YouTube, Twitter, Facebook）
- 困难平台提供"导出草稿"功能
- 后期考虑Web自动化方案（Puppeteer）
- 与第三方服务商合作

### 风险2：AI服务成本
**问题**：GPT-4和图片增强API调用成本高

**解决方案**：
- MVP阶段：限制免费使用次数
- 使用更便宜的模型（GPT-3.5-turbo）
- 图片增强使用批量处理降低成本
- 商业化后通过订阅费覆盖成本

### 风险3：图片处理性能
**问题**：批量处理大图片可能很慢

**解决方案**：
- 使用Worker线程处理图片
- 任务队列异步处理
- 添加进度反馈
- 后期使用CDN加速

### 风险4：跨平台兼容性
**问题**：不同平台对图片格式、尺寸、内容要求不同

**解决方案**：
- 建立平台规格配置
- 自动调整图片尺寸
- 提供平台优化建议
- 内容审核提示

---

## 项目文件结构（预计）

```
tupianjiashuiyinzidongfabuzimeiti/
├── README.md
├── PROJECT_PLAN.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── .env.local
├── .gitignore
│
├── public/
│   ├── fonts/
│   └── watermark-templates/
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 首页
│   │   ├── editor/               # 水印编辑器页面
│   │   ├── publish/              # 发布管理页面
│   │   └── api/                  # API Routes
│   │       ├── upload/           # 图片上传
│   │       ├── watermark/        # 水印处理
│   │       ├── ai/               # AI功能
│   │       │   ├── title/
│   │       │   ├── description/
│   │       │   └── enhance/
│   │       └── publish/          # 发布API
│   │           ├── youtube/
│   │           ├── facebook/
│   │           ├── instagram/
│   │           ├── tiktok/
│   │           ├── twitter/
│   │           ├── wechat/
│   │           └── xiaohongshu/
│   │
│   ├── components/               # React组件
│   │   ├── ui/                   # 基础UI组件
│   │   ├── ImageUploader.tsx
│   │   ├── WatermarkEditor.tsx   # Canvas编辑器
│   │   ├── ImageGallery.tsx
│   │   ├── PublishForm.tsx
│   │   └── PlatformConnector.tsx
│   │
│   ├── lib/                      # 工具库
│   │   ├── image-processor.ts    # Sharp图片处理
│   │   ├── watermark.ts          # 水印逻辑
│   │   ├── ai-service.ts         # AI API调用
│   │   ├── queue.ts              # 任务队列
│   │   └── platforms/            # 平台适配器
│   │       ├── base.ts
│   │       ├── youtube.ts
│   │       ├── facebook.ts
│   │       ├── instagram.ts
│   │       ├── tiktok.ts
│   │       ├── twitter.ts
│   │       ├── wechat.ts
│   │       └── xiaohongshu.ts
│   │
│   ├── types/                    # TypeScript类型定义
│   │   ├── image.ts
│   │   ├── watermark.ts
│   │   ├── platform.ts
│   │   └── publish.ts
│   │
│   ├── config/                   # 配置文件
│   │   ├── platforms.ts          # 平台配置
│   │   └── ai.ts                 # AI配置
│   │
│   └── styles/                   # 全局样式
│       └── globals.css
│
├── prisma/                       # 数据库（商业化阶段）
│   └── schema.prisma
│
└── docs/                         # 文档
    ├── API.md                    # API文档
    ├── DEPLOYMENT.md             # 部署指南
    └── USER_GUIDE.md             # 用户指南
```

---

## 开发环境要求

### 必需
- Node.js 18+
- npm 或 yarn
- Git

### 可选（商业化阶段）
- PostgreSQL 14+
- Redis 6+
- Docker（部署）

---

## 环境变量配置

```bash
# .env.local 示例

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

# 数据库（商业化阶段）
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# 支付（商业化阶段）
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## 下一步行动

1. **确认技术栈**：你是否同意使用 Next.js + React + TypeScript？
2. **确认开发优先级**：是否按照上述路线图的顺序开发？
3. **API准备**：需要开始申请各平台的开发者账号和API密钥
4. **初始化项目**：创建Next.js项目脚手架

请确认这个规划，我们就可以开始编码了！
