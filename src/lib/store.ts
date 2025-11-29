import { create } from 'zustand';
import { UploadedImage, WatermarkConfig, WatermarkTemplate } from '@/types/image';

interface ImageStore {
  images: UploadedImage[];
  selectedImageIds: string[];
  watermarkConfig: WatermarkConfig | null;
  watermarkTemplate: WatermarkTemplate | null; // 当前水印模板
  processedImages: Map<string, string>; // imageId -> processedDataUrl

  // 图片管理
  addImages: (images: UploadedImage[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateImageWatermark: (id: string, watermarkedPreview: string) => void;

  // 图片选择
  selectImage: (id: string) => void;
  deselectImage: (id: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;

  // 水印配置
  setWatermarkConfig: (config: WatermarkConfig) => void;
  clearWatermarkConfig: () => void;

  // 水印模板
  setWatermarkTemplate: (template: WatermarkTemplate) => void;
  clearWatermarkTemplate: () => void;

  // 处理后的图片
  addProcessedImage: (imageId: string, dataUrl: string) => void;
  clearProcessedImages: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  selectedImageIds: [],
  watermarkConfig: null,
  watermarkTemplate: null,
  processedImages: new Map(),

  // 图片管理
  addImages: (newImages) => set((state) => ({
    images: [...state.images, ...newImages]
  })),

  removeImage: (id) => set((state) => ({
    images: state.images.filter((img) => img.id !== id),
    selectedImageIds: state.selectedImageIds.filter((imgId) => imgId !== id)
  })),

  clearImages: () => set({ images: [], selectedImageIds: [], processedImages: new Map() }),

  updateImageWatermark: (id, watermarkedPreview) => set((state) => ({
    images: state.images.map((img) =>
      img.id === id ? { ...img, watermarkedPreview } : img
    )
  })),

  // 图片选择
  selectImage: (id) => set((state) => ({
    selectedImageIds: [...state.selectedImageIds, id]
  })),

  deselectImage: (id) => set((state) => ({
    selectedImageIds: state.selectedImageIds.filter((imgId) => imgId !== id)
  })),

  selectAllImages: () => set((state) => ({
    selectedImageIds: state.images.map((img) => img.id)
  })),

  clearSelection: () => set({ selectedImageIds: [] }),

  // 水印配置
  setWatermarkConfig: (config) => set({ watermarkConfig: config }),

  clearWatermarkConfig: () => set({ watermarkConfig: null }),

  // 水印模板
  setWatermarkTemplate: (template) => set({ watermarkTemplate: template }),

  clearWatermarkTemplate: () => set({ watermarkTemplate: null }),

  // 处理后的图片
  addProcessedImage: (imageId, dataUrl) => set((state) => {
    const newMap = new Map(state.processedImages);
    newMap.set(imageId, dataUrl);
    return { processedImages: newMap };
  }),

  clearProcessedImages: () => set({ processedImages: new Map() }),
}));
