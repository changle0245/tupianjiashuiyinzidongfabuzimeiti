// 图片相关类型定义

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
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

export interface ImageWithWatermark {
  id: string;
  originalImage: UploadedImage;
  watermarkConfig?: WatermarkConfig;
  processedImageUrl?: string;
}
