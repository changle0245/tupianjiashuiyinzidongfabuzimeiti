# MVP开发路线图

> 详细的开发计划，包括每个阶段的具体任务和技术实现

---

## 🎯 MVP目标

**时间**：8-10周
**范围**：核心功能可用，无需数据库，可以演示
**目的**：验证产品概念，获取早期用户反馈

---

## 📅 阶段一：项目初始化（第1周）

### 任务清单

- [x] ✅ 项目规划文档
- [ ] 初始化 Next.js 项目
- [ ] 配置 TypeScript
- [ ] 配置 Tailwind CSS
- [ ] 安装核心依赖
- [ ] 设置代码规范（ESLint + Prettier）
- [ ] 配置环境变量
- [ ] 创建基础页面布局
- [ ] 设置 Git 提交规范

### 技术实现

#### 1. 创建 Next.js 项目

```bash
# 使用 create-next-app
npx create-next-app@latest tupianjiashuiyinzidongfabuzimeiti --typescript --tailwind --app --src-dir

cd tupianjiashuiyinzidongfabuzimeiti
```

选项说明：
- `--typescript`: 启用 TypeScript
- `--tailwind`: 启用 Tailwind CSS
- `--app`: 使用新的 App Router
- `--src-dir`: 使用 src/ 目录

#### 2. 安装核心依赖

```bash
# UI组件库
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react  # 图标库

# 图片处理
npm install sharp
npm install fabric  # Canvas编辑器
npm install react-dropzone  # 文件上传

# 工具库
npm install date-fns  # 日期处理
npm install zustand  # 状态管理
npm install react-hook-form  # 表单处理
npm install zod  # 数据验证

# 开发依赖
npm install -D @types/fabric
npm install -D prettier prettier-plugin-tailwindcss
```

#### 3. 配置 shadcn/ui

```bash
# 初始化 shadcn/ui
npx shadcn-ui@latest init

# 添加常用组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add slider
```

#### 4. 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式
│   └── api/                # API路由（后续添加）
│
├── components/
│   ├── ui/                 # shadcn组件
│   └── layout/             # 布局组件
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── lib/
│   └── utils.ts            # 工具函数
│
└── types/
    └── index.ts            # TypeScript类型定义
```

#### 5. 环境变量模板

创建 `.env.example`:

```bash
# AI服务（后续配置）
OPENAI_API_KEY=
REPLICATE_API_TOKEN=

# 社交媒体API（后续配置）
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
TWITTER_API_KEY=
TWITTER_API_SECRET=
```

#### 6. Git 配置

```bash
# .gitignore 确保包含
.env.local
.env*.local
node_modules/
.next/
out/
dist/
*.log
.DS_Store
```

### 交付物

- ✅ 可运行的 Next.js 项目
- ✅ 基础UI界面（首页）
- ✅ 开发环境配置完成

---

## 📅 阶段二：图片上传和预览（第2周）

### 任务清单

- [ ] 创建图片上传组件
- [ ] 实现拖拽上传功能
- [ ] 批量图片预览
- [ ] 图片格式验证
- [ ] 文件大小限制
- [ ] 上传进度显示
- [ ] 图片删除功能
- [ ] 图片排序功能

### 技术实现

#### 1. 图片上传组件

```typescript
// src/components/ImageUploader.tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export function ImageUploader() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36),
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? '放开以上传图片' : '拖拽图片到这里，或点击选择'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          支持 JPG、PNG、WebP，单个文件最大 10MB
        </p>
      </div>

      {/* 图片预览网格 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <Image
                src={img.preview}
                alt="预览"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 2. API路由：处理图片上传

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      );
    }

    // 创建临时目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
    await mkdir(uploadDir, { recursive: true });

    // 保存文件
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 生成唯一文件名
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
        const filepath = path.join(uploadDir, uniqueName);

        await writeFile(filepath, buffer);

        return {
          filename: uniqueName,
          url: `/uploads/temp/${uniqueName}`,
          size: file.size,
          type: file.type
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: savedFiles
    });

  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}
```

### 交付物

- ✅ 可拖拽上传图片
- ✅ 批量预览功能
- ✅ 基础的图片管理

---

## 📅 阶段三：水印编辑器（第3-4周）

### 任务清单

- [ ] Canvas 编辑器基础
- [ ] 添加文字水印
  - [ ] 文字输入
  - [ ] 字体选择
  - [ ] 颜色选择
  - [ ] 大小调整
  - [ ] 透明度调整
  - [ ] 拖拽定位
- [ ] 添加图片水印
  - [ ] LOGO上传
  - [ ] 大小调整
  - [ ] 透明度调整
  - [ ] 拖拽定位
- [ ] 水印模板保存
- [ ] 批量应用水印
- [ ] 实时预览

### 技术实现

#### 1. 水印编辑器组件

```typescript
// src/components/WatermarkEditor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface WatermarkEditorProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
}

export function WatermarkEditor({ imageUrl, onSave }: WatermarkEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  // 初始化Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0'
    });

    // 加载图片
    fabric.Image.fromURL(imageUrl, (img) => {
      // 缩放图片以适应画布
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );

      img.scale(scale);
      img.set({
        selectable: false,
        evented: false
      });

      fabricCanvas.add(img);
      fabricCanvas.sendToBack(img);
      fabricCanvas.renderAll();
    });

    // 监听对象选择
    fabricCanvas.on('selection:created', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [imageUrl]);

  // 添加文字水印
  const addTextWatermark = () => {
    if (!canvas) return;

    const text = new fabric.Text('水印文字', {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeWidth: 1,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // 添加图片水印
  const addImageWatermark = (logoUrl: string) => {
    if (!canvas) return;

    fabric.Image.fromURL(logoUrl, (img) => {
      img.scale(0.3);
      img.set({
        left: 50,
        top: 50,
        opacity: 0.7
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  // 修改文字内容
  const updateText = (newText: string) => {
    if (!activeObject || activeObject.type !== 'text') return;

    (activeObject as fabric.Text).set('text', newText);
    canvas?.renderAll();
  };

  // 修改颜色
  const updateColor = (color: string) => {
    if (!activeObject) return;

    activeObject.set('fill', color);
    canvas?.renderAll();
  };

  // 修改透明度
  const updateOpacity = (opacity: number) => {
    if (!activeObject) return;

    activeObject.set('opacity', opacity / 100);
    canvas?.renderAll();
  };

  // 修改大小
  const updateSize = (scale: number) => {
    if (!activeObject) return;

    activeObject.scale(scale / 100);
    canvas?.renderAll();
  };

  // 保存水印图片
  const handleSave = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1
    });

    onSave(dataUrl);
  };

  return (
    <div className="flex gap-4">
      {/* Canvas区域 */}
      <div className="flex-1">
        <canvas ref={canvasRef} className="border rounded-lg" />

        <div className="mt-4 flex gap-2">
          <Button onClick={addTextWatermark}>添加文字</Button>
          <Button onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                addImageWatermark(url);
              }
            };
            input.click();
          }}>
            添加图片
          </Button>
          <Button onClick={handleSave} variant="default">保存</Button>
        </div>
      </div>

      {/* 编辑面板 */}
      <div className="w-64 space-y-4 border-l pl-4">
        <h3 className="font-semibold">编辑水印</h3>

        {activeObject?.type === 'text' && (
          <>
            <div>
              <label className="text-sm">文字内容</label>
              <Input
                value={(activeObject as fabric.Text).text}
                onChange={(e) => updateText(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">颜色</label>
              <Input
                type="color"
                value={activeObject.fill as string}
                onChange={(e) => updateColor(e.target.value)}
              />
            </div>
          </>
        )}

        {activeObject && (
          <>
            <div>
              <label className="text-sm">透明度: {Math.round((activeObject.opacity || 1) * 100)}%</label>
              <Slider
                value={[(activeObject.opacity || 1) * 100]}
                onValueChange={([value]) => updateOpacity(value)}
                max={100}
                step={1}
              />
            </div>

            <div>
              <label className="text-sm">大小: {Math.round((activeObject.scaleX || 1) * 100)}%</label>
              <Slider
                value={[(activeObject.scaleX || 1) * 100]}
                onValueChange={([value]) => updateSize(value)}
                min={10}
                max={200}
                step={1}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

#### 2. 批量应用水印API

```typescript
// src/app/api/watermark/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { readFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const { imageUrls, watermarkConfig } = await request.json();

    const results = await Promise.all(
      imageUrls.map(async (url: string) => {
        const imagePath = path.join(process.cwd(), 'public', url);
        const imageBuffer = await readFile(imagePath);

        let image = sharp(imageBuffer);

        // 添加文字水印
        if (watermarkConfig.type === 'text') {
          const svg = `
            <svg width="800" height="600">
              <text
                x="${watermarkConfig.x}"
                y="${watermarkConfig.y}"
                font-size="${watermarkConfig.fontSize}"
                fill="${watermarkConfig.color}"
                opacity="${watermarkConfig.opacity}"
              >
                ${watermarkConfig.text}
              </text>
            </svg>
          `;

          image = image.composite([{
            input: Buffer.from(svg),
            top: 0,
            left: 0
          }]);
        }

        const outputBuffer = await image.png().toBuffer();
        const base64 = outputBuffer.toString('base64');

        return `data:image/png;base64,${base64}`;
      })
    );

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('批量处理失败:', error);
    return NextResponse.json(
      { error: '批量处理失败' },
      { status: 500 }
    );
  }
}
```

### 交付物

- ✅ 功能完整的水印编辑器
- ✅ 支持文字和图片水印
- ✅ 可拖拽、调整大小
- ✅ 批量应用功能

---

## 📅 阶段四：图片编辑功能（第5周）

### 任务清单

- [ ] 图片裁剪功能
- [ ] 图片旋转
- [ ] 亮度/对比度调整
- [ ] 图片预览对比

### 技术实现

使用 `react-image-crop` 库实现裁剪：

```bash
npm install react-image-crop
```

```typescript
// src/components/ImageCropper.tsx
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// 实现细节...
```

使用 Sharp 进行服务端处理：

```typescript
// src/app/api/image/edit/route.ts
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const { image, operations } = await request.json();

  let processor = sharp(Buffer.from(image, 'base64'));

  // 裁剪
  if (operations.crop) {
    processor = processor.extract({
      left: operations.crop.x,
      top: operations.crop.y,
      width: operations.crop.width,
      height: operations.crop.height
    });
  }

  // 旋转
  if (operations.rotate) {
    processor = processor.rotate(operations.rotate);
  }

  // 调整亮度/对比度
  if (operations.brightness || operations.contrast) {
    processor = processor.modulate({
      brightness: operations.brightness || 1,
      saturation: operations.saturation || 1
    });
  }

  const result = await processor.png().toBuffer();
  return NextResponse.json({
    image: result.toString('base64')
  });
}
```

### 交付物

- ✅ 图片裁剪功能
- ✅ 基础图片编辑

---

## 📅 阶段五：AI功能集成（第6周）

### 任务清单

- [ ] OpenAI API集成
- [ ] AI生成标题
- [ ] AI生成描述
- [ ] AI图片增强（Replicate API）
- [ ] 提示词优化
- [ ] 错误处理和重试

### 技术实现

#### 1. 安装依赖

```bash
npm install openai replicate
```

#### 2. AI生成标题API

```typescript
// src/app/api/ai/title/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { context, platform } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的${platform}内容标题创作专家。请生成吸引人的标题。`
        },
        {
          role: 'user',
          content: `为以下内容生成3个吸引人的标题：${context}`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const titles = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, ''));

    return NextResponse.json({
      success: true,
      titles
    });

  } catch (error) {
    console.error('AI生成失败:', error);
    return NextResponse.json(
      { error: 'AI生成失败' },
      { status: 500 }
    );
  }
}
```

#### 3. AI图片增强API

```typescript
// src/app/api/ai/enhance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 2,
          face_enhance: false
        }
      }
    );

    return NextResponse.json({
      success: true,
      enhancedImage: output
    });

  } catch (error) {
    console.error('图片增强失败:', error);
    return NextResponse.json(
      { error: '图片增强失败' },
      { status: 500 }
    );
  }
}
```

### 交付物

- ✅ AI生成标题/描述
- ✅ AI图片增强功能

---

## 📅 阶段六：定时发布系统（第7周）

### 任务清单

- [ ] 发布配置界面
- [ ] 任务队列系统
- [ ] 定时调度
- [ ] 发布状态管理
- [ ] 简单的任务列表

### 技术实现

#### 1. 安装依赖

```bash
# 使用简化的内存队列（MVP阶段）
npm install better-queue
npm install node-cron
```

#### 2. 任务队列服务

```typescript
// src/lib/queue.ts
import Queue from 'better-queue';

interface PublishTask {
  id: string;
  platform: string;
  imageUrl: string;
  title: string;
  description: string;
  scheduledTime: Date;
}

class PublishQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(async (task: PublishTask, cb) => {
      try {
        await this.processTask(task);
        cb(null, { success: true });
      } catch (error) {
        cb(error as Error);
      }
    });
  }

  private async processTask(task: PublishTask) {
    console.log(`发布到 ${task.platform}:`, task.title);

    // 调用对应平台的发布函数
    switch (task.platform) {
      case 'youtube':
        await this.publishToYouTube(task);
        break;
      case 'twitter':
        await this.publishToTwitter(task);
        break;
      // ... 其他平台
    }
  }

  addTask(task: PublishTask) {
    this.queue.push(task);
  }

  private async publishToYouTube(task: PublishTask) {
    // 实现YouTube发布逻辑
  }

  private async publishToTwitter(task: PublishTask) {
    // 实现Twitter发布逻辑
  }
}

export const publishQueue = new PublishQueue();
```

#### 3. 定时任务检查

```typescript
// src/lib/scheduler.ts
import cron from 'node-cron';
import { publishQueue } from './queue';

// 每分钟检查待发布任务
cron.schedule('* * * * *', () => {
  checkPendingTasks();
});

async function checkPendingTasks() {
  // 从存储中获取待发布任务
  // MVP阶段可以用全局变量或文件存储
  const tasks = getPendingTasks();

  const now = new Date();

  tasks.forEach(task => {
    if (task.scheduledTime <= now) {
      publishQueue.addTask(task);
    }
  });
}
```

### 交付物

- ✅ 定时发布系统
- ✅ 任务队列管理

---

## 📅 阶段七：社交媒体API集成（第8-9周）

### 优先级

1. **YouTube**（最简单）
2. **Twitter/X**
3. **Facebook**
4. **Instagram**
5. **TikTok**
6. **微信视频号**（如果API可用）
7. **小红书**（备用方案：导出草稿）

### YouTube集成示例

```bash
npm install googleapis
```

```typescript
// src/lib/platforms/youtube.ts
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function publishToYouTube({
  title,
  description,
  videoFile,
  accessToken
}: {
  title: string;
  description: string;
  videoFile: Buffer;
  accessToken: string;
}) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const response = await youtube.videos.insert({
    auth: oauth2Client,
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        categoryId: '22' // People & Blogs
      },
      status: {
        privacyStatus: 'public'
      }
    },
    media: {
      body: videoFile
    }
  });

  return response.data;
}
```

### 交付物

- ✅ 至少接入2-3个平台
- ✅ OAuth2认证流程
- ✅ 发布功能可用

---

## 📅 阶段八：测试和优化（第10周）

### 任务清单

- [ ] 功能测试
- [ ] 性能优化
- [ ] UI/UX优化
- [ ] 错误处理完善
- [ ] 文档编写
- [ ] 部署到Vercel

### 部署步骤

```bash
# 1. 连接到Vercel
vercel login
vercel link

# 2. 配置环境变量
vercel env add OPENAI_API_KEY
vercel env add REPLICATE_API_TOKEN
# ... 其他环境变量

# 3. 部署
vercel --prod
```

### 交付物

- ✅ 可用的MVP产品
- ✅ 部署到生产环境
- ✅ 用户文档

---

## 🎯 MVP成功标准

### 功能指标

- [x] 用户可以上传多张图片
- [ ] 用户可以添加文字和图片水印
- [ ] 水印可以拖拽和调整大小
- [ ] 可以批量应用水印到所有图片
- [ ] AI可以生成标题和描述
- [ ] AI可以增强图片质量
- [ ] 可以配置定时发布
- [ ] 至少支持2个社交媒体平台自动发布
- [ ] 不支持的平台可以导出草稿

### 性能指标

- [ ] 页面加载时间 < 3秒
- [ ] 图片处理时间 < 5秒/张
- [ ] AI生成时间 < 10秒
- [ ] 支持同时处理20张图片

### 用户体验指标

- [ ] 界面友好，无需教程即可使用
- [ ] 所有操作有明确反馈
- [ ] 错误提示清晰
- [ ] 移动端基本可用

---

## 📊 时间和资源估算

### 开发时间

| 阶段 | 任务 | 预计时间 | 累计时间 |
|------|------|----------|----------|
| 1 | 项目初始化 | 1周 | 1周 |
| 2 | 图片上传 | 1周 | 2周 |
| 3 | 水印编辑器 | 2周 | 4周 |
| 4 | 图片编辑 | 1周 | 5周 |
| 5 | AI功能 | 1周 | 6周 |
| 6 | 定时发布 | 1周 | 7周 |
| 7 | 平台集成 | 2周 | 9周 |
| 8 | 测试优化 | 1周 | 10周 |

**总计：8-10周**（约2-2.5个月）

### 成本估算（MVP阶段）

| 项目 | 费用 | 说明 |
|------|------|------|
| 开发服务器 | $0 | 本地开发 |
| Vercel部署 | $0 | 免费版够用 |
| OpenAI API | $20-50/月 | 测试阶段少量调用 |
| Replicate API | $10-30/月 | 按使用量付费 |
| 域名 | $12/年 | .com域名 |

**MVP总成本：约$30-80/月**

---

## 🚀 下一步

确认这个路线图后，我们可以：

1. ✅ 开始阶段一：初始化Next.js项目
2. 创建基础UI界面
3. 实现第一个功能模块

准备好开始了吗？
