import { create } from 'zustand';
import { UploadedImage, WatermarkConfig } from '@/types/image';

interface ImageStore {
  images: UploadedImage[];
  selectedImageIds: string[];
  watermarkConfig: WatermarkConfig | null;

  // 图片管理
  addImages: (images: UploadedImage[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;

  // 图片选择
  selectImage: (id: string) => void;
  deselectImage: (id: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;

  // 水印配置
  setWatermarkConfig: (config: WatermarkConfig) => void;
  clearWatermarkConfig: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  selectedImageIds: [],
  watermarkConfig: null,

  // 图片管理
  addImages: (newImages) => set((state) => ({
    images: [...state.images, ...newImages]
  })),

  removeImage: (id) => set((state) => ({
    images: state.images.filter((img) => img.id !== id),
    selectedImageIds: state.selectedImageIds.filter((imgId) => imgId !== id)
  })),

  clearImages: () => set({ images: [], selectedImageIds: [] }),

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
}));
