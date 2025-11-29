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
