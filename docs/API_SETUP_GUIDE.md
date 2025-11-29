# API配置和平台集成指南

> 详细的API密钥申请和配置步骤

---

## 🔑 需要的API密钥

在开始开发之前，你需要申请以下服务的API密钥：

### ✅ 必需（核心功能）

1. **OpenAI API** - AI生成标题和描述
2. **Replicate API** - AI图片增强

### ⚠️ 可选（按需申请）

3. **YouTube Data API** - YouTube发布
4. **Twitter API v2** - 推特发布
5. **Facebook Graph API** - Facebook/Instagram发布
6. **TikTok API** - TikTok发布
7. **微信开放平台** - 微信视频号

---

## 1️⃣ OpenAI API

### 申请步骤

1. **注册OpenAI账号**
   - 访问：https://platform.openai.com/signup
   - 使用邮箱注册（支持Gmail、Outlook等）
   - 验证邮箱

2. **创建API密钥**
   - 登录后访问：https://platform.openai.com/api-keys
   - 点击 "Create new secret key"
   - 输入名称（如：watermark-app）
   - **重要**：立即复制密钥，只显示一次！

3. **充值**
   - 访问：https://platform.openai.com/account/billing
   - 最低充值 $5
   - 支持信用卡支付

### 费用说明

| 模型 | 输入价格 | 输出价格 | 适用场景 |
|------|----------|----------|----------|
| GPT-3.5-turbo | $0.0015/1K tokens | $0.002/1K tokens | MVP阶段（推荐）|
| GPT-4 | $0.03/1K tokens | $0.06/1K tokens | 正式版（效果更好）|

**估算**：
- 生成1个标题 ≈ 100 tokens ≈ $0.0002（GPT-3.5）
- 每月1000次 ≈ $0.20

### 配置

```bash
# .env.local
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 测试

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: '你好' }]
});

console.log(response.choices[0].message.content);
```

---

## 2️⃣ Replicate API

### 申请步骤

1. **注册Replicate账号**
   - 访问：https://replicate.com/signin
   - 使用GitHub账号登录（推荐）

2. **获取API Token**
   - 访问：https://replicate.com/account/api-tokens
   - 复制默认Token，或创建新Token

3. **充值**
   - 访问：https://replicate.com/account/billing
   - 按使用付费，无需预充值
   - 首次注册送 $0.05 免费额度

### 费用说明

| 模型 | 价格 | 处理时间 |
|------|------|----------|
| Real-ESRGAN | $0.0023/运行 | ~5秒 |
| Stable Diffusion | $0.0019/运行 | ~3秒 |

**估算**：
- 增强1张图片 ≈ $0.0023
- 每月1000张 ≈ $2.30

### 配置

```bash
# .env.local
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 测试

```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

const output = await replicate.run(
  "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
  {
    input: {
      image: "https://example.com/image.jpg"
    }
  }
);

console.log(output);
```

---

## 3️⃣ YouTube Data API

### 申请步骤

1. **创建Google Cloud项目**
   - 访问：https://console.cloud.google.com/
   - 点击 "Select a project" → "New Project"
   - 输入项目名称（如：watermark-publisher）
   - 点击 "Create"

2. **启用YouTube Data API**
   - 在左侧菜单选择 "APIs & Services" → "Library"
   - 搜索 "YouTube Data API v3"
   - 点击 "Enable"

3. **创建OAuth 2.0凭据**
   - 访问 "APIs & Services" → "Credentials"
   - 点击 "Create Credentials" → "OAuth client ID"
   - 应用类型选择 "Web application"
   - 添加授权重定向URI：
     - `http://localhost:3000/api/auth/callback/youtube`
     - `https://yourdomain.com/api/auth/callback/youtube`
   - 复制 Client ID 和 Client Secret

4. **配置OAuth同意屏幕**
   - 选择 "External"（外部用户）
   - 填写应用名称、邮箱等信息
   - 添加测试用户（你的YouTube账号）

### 配置

```bash
# .env.local
YOUTUBE_CLIENT_ID=xxxxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/callback/youtube
```

### 使用限制

- 每天配额：10,000单位
- 上传视频消耗：1600单位
- **每天最多上传6个视频**

### OAuth2认证流程

```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// 1. 生成授权URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/youtube.upload']
});

// 2. 用户访问authUrl并授权

// 3. 获取tokens
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);

// 4. 上传视频
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
await youtube.videos.insert({
  part: ['snippet', 'status'],
  requestBody: {
    snippet: {
      title: '我的视频',
      description: '视频描述'
    },
    status: { privacyStatus: 'public' }
  },
  media: { body: videoFile }
});
```

---

## 4️⃣ Twitter API v2

### 申请步骤

1. **申请开发者账号**
   - 访问：https://developer.twitter.com/
   - 点击 "Sign up"
   - 使用Twitter账号登录

2. **创建开发者项目**
   - 填写申请表：
     - 使用目的：Content publishing tool
     - 应用描述：详细描述你的项目
   - 等待审核（通常1-2天）

3. **创建App**
   - 审核通过后，访问：https://developer.twitter.com/en/portal/projects-and-apps
   - 点击 "Create App"
   - 输入App名称

4. **获取API密钥**
   - 在App设置中找到 "Keys and tokens"
   - 生成 "API Key and Secret"
   - 生成 "Access Token and Secret"

5. **配置权限**
   - 在App设置中选择 "User authentication settings"
   - 权限设置为 "Read and Write"
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter`

### 配置

```bash
# .env.local
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_BEARER_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 使用限制（免费版）

- 每月发推文：1,500条
- 每月读取：10,000条
- **足够MVP使用**

### 发推文示例

```typescript
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!
});

// 上传图片
const mediaId = await client.v1.uploadMedia('./image.jpg');

// 发推文
await client.v2.tweet({
  text: '我的推文内容',
  media: { media_ids: [mediaId] }
});
```

---

## 5️⃣ Facebook Graph API (Facebook + Instagram)

### 申请步骤

1. **创建Facebook开发者账号**
   - 访问：https://developers.facebook.com/
   - 使用Facebook账号登录
   - 完成开发者注册

2. **创建应用**
   - 点击 "My Apps" → "Create App"
   - 选择类型：Business
   - 输入应用名称和联系邮箱

3. **添加产品**
   - 在应用控制台，点击 "Add Product"
   - 添加 "Facebook Login"
   - 添加 "Instagram Basic Display"

4. **获取访问令牌**
   - 在 "Tools" → "Graph API Explorer"
   - 选择你的应用
   - 请求权限：
     - `pages_read_engagement`
     - `pages_manage_posts`
     - `instagram_basic`
     - `instagram_content_publish`
   - 生成访问令牌

5. **转换为长期令牌**
   ```
   GET https://graph.facebook.com/v18.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```

### 配置

```bash
# .env.local
FACEBOOK_APP_ID=xxxxxxxxxxxxx
FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 发布到Facebook

```typescript
const response = await fetch(
  `https://graph.facebook.com/v18.0/${pageId}/photos`,
  {
    method: 'POST',
    body: JSON.stringify({
      url: imageUrl,
      caption: '图片描述',
      access_token: process.env.FACEBOOK_ACCESS_TOKEN
    })
  }
);
```

### 发布到Instagram

```typescript
// 1. 创建容器
const containerResponse = await fetch(
  `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
  {
    method: 'POST',
    body: JSON.stringify({
      image_url: imageUrl,
      caption: '图片描述',
      access_token: process.env.FACEBOOK_ACCESS_TOKEN
    })
  }
);

const { id: creationId } = await containerResponse.json();

// 2. 发布容器
await fetch(
  `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
  {
    method: 'POST',
    body: JSON.stringify({
      creation_id: creationId,
      access_token: process.env.FACEBOOK_ACCESS_TOKEN
    })
  }
);
```

---

## 6️⃣ TikTok Content Posting API

### 申请步骤

1. **注册TikTok开发者账号**
   - 访问：https://developers.tiktok.com/
   - 使用TikTok账号登录

2. **创建应用**
   - 在开发者控制台，点击 "Manage apps"
   - 点击 "Connect an app"
   - 填写应用信息

3. **申请Content Posting API权限**
   - 在应用设置中，申请 "Content Posting API"
   - 需要提供：
     - 应用详细描述
     - 使用场景说明
     - 预计用户量
   - 审核时间：1-2周

4. **获取密钥**
   - 审核通过后，在 "Credentials" 页面获取
   - Client Key 和 Client Secret

### 配置

```bash
# .env.local
TIKTOK_CLIENT_KEY=xxxxxxxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxx
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiktok
```

### OAuth2认证

```typescript
// 1. 生成授权URL
const authUrl = `https://www.tiktok.com/v2/auth/authorize/`;
const params = new URLSearchParams({
  client_key: process.env.TIKTOK_CLIENT_KEY!,
  scope: 'user.info.basic,video.upload',
  response_type: 'code',
  redirect_uri: process.env.TIKTOK_REDIRECT_URI!
});

// 2. 获取access token
const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    client_secret: process.env.TIKTOK_CLIENT_SECRET!,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.TIKTOK_REDIRECT_URI!
  })
});

// 3. 上传视频
const uploadResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    post_info: {
      title: '视频标题',
      description: '视频描述',
      privacy_level: 'SELF_ONLY'
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: videoBuffer.length
    }
  })
});
```

### 注意事项

- TikTok需要上传**视频**，不支持纯图片
- 需要将图片转换为视频（可用ffmpeg）
- API审核较严格，需要详细说明用途

---

## 7️⃣ 微信开放平台

### 申请步骤

1. **注册微信开放平台账号**
   - 访问：https://open.weixin.qq.com/
   - 需要企业认证（个人无法申请）
   - 费用：300元/年

2. **创建网站应用**
   - 在管理中心，选择 "网站应用"
   - 填写应用信息
   - 等待审核（3-7天）

3. **申请视频号权限**
   - 审核通过后，申请 "视频号" 接口权限
   - 可能需要额外审核

4. **获取密钥**
   - AppID
   - AppSecret

### 配置

```bash
# .env.local
WECHAT_APP_ID=wxxxxxxxxxxxxxxxxxxx
WECHAT_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ⚠️ 注意事项

- **微信视频号API可能不对所有开发者开放**
- 需要企业资质
- 审核严格
- **备用方案**：导出内容，用户手动上传

### 备用方案：导出草稿

如果无法获得API权限，提供导出功能：

```typescript
// 导出为微信视频号格式
export function exportForWechat(data: {
  images: string[];
  title: string;
  description: string;
}) {
  // 将图片打包成ZIP
  // 生成文案文件（title.txt, description.txt）
  // 用户手动上传到微信视频号
}
```

---

## 8️⃣ 小红书

### 现状

- ❌ **小红书目前没有公开的内容发布API**
- 只有企业合作伙伴可能获得接口

### 备用方案

#### 方案1：第三方服务

使用第三方自媒体管理工具的API：
- **蚁小二**：https://www.yixiaoer.cn/
- **新榜**：https://www.newrank.cn/
- **爱豆子**：https://www.idouzi.com/

这些工具可能提供小红书发布能力。

#### 方案2：Web自动化（不推荐）

使用Puppeteer自动化浏览器操作：

```typescript
import puppeteer from 'puppeteer';

async function publishToXiaohongshu({
  images,
  title,
  description
}: {
  images: string[];
  title: string;
  description: string;
}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 登录小红书
  await page.goto('https://creator.xiaohongshu.com/');

  // 自动化上传流程...
  // 但这违反了小红书的服务条款，不推荐！

  await browser.close();
}
```

**问题**：
- 违反服务条款，账号可能被封
- 维护成本高（页面结构变化）
- 不稳定

#### 方案3：导出草稿（推荐）

```typescript
export function exportForXiaohongshu(data: {
  images: string[];
  title: string;
  description: string;
  tags: string[];
}) {
  return {
    images: data.images,
    content: `${data.title}\n\n${data.description}\n\n${data.tags.map(t => `#${t}`).join(' ')}`,
    instruction: '请手动上传图片到小红书，并复制文案'
  };
}
```

### 推荐做法（MVP阶段）

**提供"一键复制"功能**：
1. 自动生成符合小红书规范的文案
2. 图片自动添加水印
3. 一键打包下载
4. 提供上传指引

用户手动上传比违规自动化更安全。

---

## 📋 API配置检查清单

### MVP阶段必需

- [ ] OpenAI API密钥已配置
- [ ] Replicate API密钥已配置
- [ ] 测试AI生成功能正常
- [ ] 测试图片增强功能正常

### 社交媒体（按优先级）

- [ ] YouTube API已配置并测试
- [ ] Twitter API已配置并测试
- [ ] Facebook API已配置并测试
- [ ] Instagram API已配置并测试
- [ ] TikTok API已申请
- [ ] 微信API已申请或准备导出方案
- [ ] 小红书准备导出方案

---

## 🔒 API密钥安全

### 1. 使用环境变量

```bash
# ✅ 正确：使用.env.local
OPENAI_API_KEY=sk-xxx

# ❌ 错误：硬编码在代码中
const apiKey = 'sk-xxx'; // 永远不要这样做！
```

### 2. .gitignore配置

```bash
# .gitignore
.env
.env.local
.env*.local
```

### 3. Vercel环境变量

在Vercel部署时：
```bash
# 命令行配置
vercel env add OPENAI_API_KEY

# 或在Vercel控制台：
# Settings → Environment Variables
```

### 4. 限制API使用

- 设置月度使用上限
- 监控异常调用
- 使用速率限制

---

## 💰 总成本估算

### MVP阶段（每月）

| 服务 | 费用 | 说明 |
|------|------|------|
| OpenAI | $5-20 | 少量测试 |
| Replicate | $5-10 | 图片增强 |
| Vercel | $0 | 免费版 |
| 域名 | $1 | 按年分摊 |
| **总计** | **$11-31/月** | |

### 正式运营（1000用户/月）

| 服务 | 费用 | 说明 |
|------|------|------|
| OpenAI | $50-100 | AI生成 |
| Replicate | $20-50 | 图片增强 |
| 云服务器 | $50-100 | 数据库+存储 |
| CDN | $10-20 | 图片加速 |
| 域名 | $1 | |
| **总计** | **$131-271/月** | |

**收入预估**：
- 如果10%用户付费($9.99/月)
- 100用户 × $9.99 = $999/月
- **利润**：$999 - $271 = **$728/月**

---

## 🚀 快速开始

1. **必需的API**（先申请这些）
   ```bash
   # 1. OpenAI（5分钟）
   https://platform.openai.com/signup

   # 2. Replicate（2分钟）
   https://replicate.com/signin
   ```

2. **可选的API**（按需申请）
   ```bash
   # 根据你想支持的平台，依次申请
   # YouTube → Twitter → Facebook → ...
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local，填入API密钥
   ```

4. **测试连接**
   ```bash
   npm run test:api
   # 测试所有API连接是否正常
   ```

---

## ❓ 常见问题

### Q: 必须申请所有API吗？
A: 不需要。MVP阶段先申请OpenAI和Replicate，社交媒体API按需申请。

### Q: API申请需要多久？
A: OpenAI和Replicate立即可用。YouTube、Twitter需要1-3天。TikTok、微信需要1-2周。

### Q: 没有企业资质怎么办？
A: 大部分API个人可申请。微信需要企业资质，可以用导出功能替代。

### Q: API调用费用会很高吗？
A: MVP阶段每月$10-30足够。有用户付费后可覆盖成本。

### Q: 如何防止API密钥泄露？
A: 使用.env.local，永远不要提交到Git。在Vercel中使用环境变量。

---

准备好申请API密钥了吗？从OpenAI和Replicate开始！🚀
