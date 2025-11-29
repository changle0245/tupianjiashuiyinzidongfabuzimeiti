import { create } from 'zustand';
import { UploadedImage, WatermarkConfig, WatermarkTemplate, PublishTask } from '@/types/image';

interface ImageStore {
  images: UploadedImage[];
  selectedImageIds: string[];
  watermarkConfig: WatermarkConfig | null;
  watermarkTemplate: WatermarkTemplate | null; // 当前水印模板
  watermarkTemplates: WatermarkTemplate[]; // 所有保存的模板
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
  addWatermarkTemplate: (template: WatermarkTemplate) => void;
  updateWatermarkTemplate: (id: string, updates: Partial<WatermarkTemplate>) => void;
  removeWatermarkTemplate: (id: string) => void;

  // 处理后的图片
  addProcessedImage: (imageId: string, dataUrl: string) => void;
  clearProcessedImages: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  selectedImageIds: [],
  watermarkConfig: null,
  watermarkTemplate: null,
  watermarkTemplates: [],
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

  addWatermarkTemplate: (template) => set((state) => ({
    watermarkTemplates: [...state.watermarkTemplates, template],
    watermarkTemplate: template, // 同时设置为当前模板
  })),

  updateWatermarkTemplate: (id, updates) => set((state) => ({
    watermarkTemplates: state.watermarkTemplates.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    ),
  })),

  removeWatermarkTemplate: (id) => set((state) => ({
    watermarkTemplates: state.watermarkTemplates.filter((t) => t.id !== id),
    watermarkTemplate: state.watermarkTemplate?.id === id ? null : state.watermarkTemplate,
  })),

  // 处理后的图片
  addProcessedImage: (imageId, dataUrl) => set((state) => {
    const newMap = new Map(state.processedImages);
    newMap.set(imageId, dataUrl);
    return { processedImages: newMap };
  }),

  clearProcessedImages: () => set({ processedImages: new Map() }),
}));

// 发布任务Store
interface PublishStore {
  tasks: PublishTask[];

  // 任务管理
  addTask: (task: PublishTask) => void;
  updateTask: (id: string, updates: Partial<PublishTask>) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;

  // 任务查询
  getTaskById: (id: string) => PublishTask | undefined;
  getTasksByStatus: (status: PublishTask['status']) => PublishTask[];
  getScheduledTasks: () => PublishTask[];
}

export const usePublishStore = create<PublishStore>((set, get) => ({
  tasks: [],

  // 任务管理
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    )
  })),

  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),

  clearTasks: () => set({ tasks: [] }),

  // 任务查询
  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },

  getScheduledTasks: () => {
    return get().tasks.filter(
      (task) => task.status === 'scheduled' && !task.isImmediate
    );
  },
}));
