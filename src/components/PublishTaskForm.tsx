'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Send, Save } from 'lucide-react';
import { PublishTask, Platform } from '@/types/image';
import { useImageStore } from '@/lib/store';
import { PLATFORM_CONFIGS, getAllPlatforms } from '@/lib/platforms';

interface PublishTaskFormProps {
  task?: PublishTask; // 编辑模式传入已有任务
  onSubmit: (task: PublishTask) => void;
  onCancel: () => void;
}

export function PublishTaskForm({ task, onSubmit, onCancel }: PublishTaskFormProps) {
  const images = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
    task?.platforms || []
  );
  const [selectedImages, setSelectedImages] = useState<string[]>(
    task?.imageIds || selectedImageIds
  );
  const [isImmediate, setIsImmediate] = useState(task?.isImmediate ?? true);
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (task && !task.isImmediate) {
      const date = new Date(task.publishTime);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);
      setPublishDate(dateStr);
      setPublishTime(timeStr);
    }
  }, [task]);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const toggleImage = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = '请输入标题';
    }

    if (!description.trim()) {
      newErrors.description = '请输入描述';
    }

    if (selectedPlatforms.length === 0) {
      newErrors.platforms = '请至少选择一个发布平台';
    }

    if (selectedImages.length === 0) {
      newErrors.images = '请至少选择一张图片';
    }

    if (!isImmediate) {
      if (!publishDate) {
        newErrors.publishDate = '请选择发布日期';
      }
      if (!publishTime) {
        newErrors.publishTime = '请选择发布时间';
      }
      if (publishDate && publishTime) {
        const scheduledTime = new Date(`${publishDate}T${publishTime}`);
        if (scheduledTime <= new Date()) {
          newErrors.publishTime = '发布时间必须在未来';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (isDraft: boolean = false) => {
    if (!validate() && !isDraft) {
      return;
    }

    let publishTime: Date;
    if (isImmediate) {
      publishTime = new Date();
    } else {
      publishTime = new Date(`${publishDate}T${publishTime}`);
    }

    const newTask: PublishTask = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      platforms: selectedPlatforms,
      imageIds: selectedImages,
      publishTime,
      status: isDraft ? 'draft' : isImmediate ? 'scheduled' : 'scheduled',
      isImmediate,
      createdAt: task?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSubmit(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? '编辑发布任务' : '创建发布任务'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="为你的内容添加一个吸引人的标题..."
              className={`w-full px-4 py-3 border ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述你的内容..."
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              字数: {description.length}
            </p>
          </div>

          {/* 选择平台 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              发布平台 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getAllPlatforms().map((platform) => {
                const config = PLATFORM_CONFIGS[platform];
                const isSelected = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`p-4 border-2 rounded-lg transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{config.icon}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {config.name}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.platforms && (
              <p className="text-sm text-red-600 mt-2">{errors.platforms}</p>
            )}
          </div>

          {/* 选择图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择图片 <span className="text-red-500">*</span>
            </label>
            {images.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
                请先上传图片
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {images.map((image) => {
                  const isSelected = selectedImages.includes(image.id);
                  return (
                    <div
                      key={image.id}
                      onClick={() => toggleImage(image.id)}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.watermarkedPreview || image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {errors.images && (
              <p className="text-sm text-red-600 mt-2">{errors.images}</p>
            )}
          </div>

          {/* 发布时间设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              发布时间
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  checked={isImmediate}
                  onChange={() => setIsImmediate(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">立即发布</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  checked={!isImmediate}
                  onChange={() => setIsImmediate(false)}
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">定时发布</span>
                  </div>
                  {!isImmediate && (
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          日期
                        </label>
                        <input
                          type="date"
                          value={publishDate}
                          onChange={(e) => setPublishDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.publishDate && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.publishDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          时间
                        </label>
                        <input
                          type="time"
                          value={publishTime}
                          onChange={(e) => setPublishTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.publishTime && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.publishTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            取消
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            存为草稿
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2"
          >
            {isImmediate ? (
              <>
                <Send className="w-4 h-4" />
                立即发布
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                调度发布
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
