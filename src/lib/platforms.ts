import { PlatformConfig, Platform } from '@/types/image';

// 平台配置数据
export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    maxImageSize: 2, // MB
  },
  wechat: {
    id: 'wechat',
    name: '微信视频号',
    icon: '💬',
    color: '#07C160',
    maxTitleLength: 30,
    maxDescriptionLength: 1000,
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    maxImageSize: 5,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    maxTitleLength: 150,
    maxDescriptionLength: 2200,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    maxImageSize: 3,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    maxTitleLength: undefined, // Instagram没有单独的标题
    maxDescriptionLength: 2200,
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    maxImageSize: 8,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '👍',
    color: '#1877F2',
    maxTitleLength: undefined,
    maxDescriptionLength: 63206,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    maxImageSize: 4,
  },
  xiaohongshu: {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    color: '#FF2442',
    maxTitleLength: 20,
    maxDescriptionLength: 1000,
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    maxImageSize: 5,
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    color: '#1DA1F2',
    maxTitleLength: undefined,
    maxDescriptionLength: 280,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxImageSize: 5,
  },
};

// 获取平台配置
export const getPlatformConfig = (platform: Platform): PlatformConfig => {
  return PLATFORM_CONFIGS[platform];
};

// 获取所有平台
export const getAllPlatforms = (): Platform[] => {
  return Object.keys(PLATFORM_CONFIGS) as Platform[];
};

// 获取平台显示名称
export const getPlatformName = (platform: Platform): string => {
  return PLATFORM_CONFIGS[platform].name;
};

// 获取平台图标
export const getPlatformIcon = (platform: Platform): string => {
  return PLATFORM_CONFIGS[platform].icon;
};

// 获取平台颜色
export const getPlatformColor = (platform: Platform): string => {
  return PLATFORM_CONFIGS[platform].color;
};
