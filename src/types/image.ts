// 图片相关类型定义

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  watermarkedPreview?: string; // 添加水印后的预览图
}

export interface WatermarkConfig {
  type: 'text' | 'image';
  // 文字水印配置
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  // 图片水印配置
  imageUrl?: string;
  // 通用配置
  x: number;
  y: number;
  opacity: number;
  rotation?: number;
  scale?: number;
}

// 水印模板（保存完整的Canvas状态）
export interface WatermarkTemplate {
  id: string;
  name: string;
  canvasJSON: string; // Fabric.js Canvas的JSON序列化
  thumbnail?: string; // 预览缩略图
  createdAt: Date;
}

export interface ImageWithWatermark {
  id: string;
  originalImage: UploadedImage;
  watermarkConfig?: WatermarkConfig;
  processedImageUrl?: string;
}

// 支持的发布平台
export type Platform =
  | 'youtube'
  | 'wechat'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'xiaohongshu'
  | 'twitter';

// 发布任务状态
export type PublishStatus =
  | 'draft'      // 草稿
  | 'scheduled'  // 已调度
  | 'publishing' // 发布中
  | 'published'  // 已发布
  | 'failed'     // 失败
  | 'cancelled'; // 已取消

// 发布任务
export interface PublishTask {
  id: string;
  title: string;              // 标题
  description: string;        // 描述
  platforms: Platform[];      // 目标平台（可多选）
  imageIds: string[];         // 关联的图片ID列表
  publishTime: Date;          // 发布时间（立即或定时）
  status: PublishStatus;      // 任务状态
  isImmediate: boolean;       // 是否立即发布
  createdAt: Date;            // 创建时间
  updatedAt: Date;            // 更新时间
  publishedAt?: Date;         // 实际发布时间
  error?: string;             // 错误信息（如果失败）
  platformResults?: {         // 各平台发布结果
    [key in Platform]?: {
      success: boolean;
      postUrl?: string;       // 发布后的链接
      error?: string;
    }
  };
}

// 平台配置
export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;               // 图标emoji或类名
  color: string;              // 主题颜色
  maxTitleLength?: number;    // 标题最大长度
  maxDescriptionLength?: number; // 描述最大长度
  supportedFormats: string[]; // 支持的图片格式
  maxImageSize?: number;      // 最大图片大小（MB）
}
