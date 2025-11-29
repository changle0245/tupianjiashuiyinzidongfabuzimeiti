'use client';

import { useState } from 'react';
import { Wand2, Download, Loader2, ZoomIn, X } from 'lucide-react';
import { UploadedImage } from '@/types/image';
import { useImageStore } from '@/lib/store';

interface AIImageEnhancerProps {
  images?: UploadedImage[];
  onEnhanced?: (imageId: string, enhancedUrl: string) => void;
}

export function AIImageEnhancer({ images, onEnhanced }: AIImageEnhancerProps) {
  const storeImages = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);

  const imagesToEnhance = images || storeImages.filter((img) => selectedImageIds.includes(img.id));

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enhancedImages, setEnhancedImages] = useState<Map<string, string>>(new Map());
  const [scale, setScale] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ original: string; enhanced: string } | null>(null);

  const enhanceImages = async () => {
    if (imagesToEnhance.length === 0) {
      setError('请选择要增强的图片');
      return;
    }

    setIsEnhancing(true);
    setError(null);
    setEnhancedImages(new Map());
    setCurrentImageIndex(0);

    const newEnhancedImages = new Map<string, string>();

    for (let i = 0; i < imagesToEnhance.length; i++) {
      const image = imagesToEnhance[i];
      setCurrentImageIndex(i);

      try {
        // 调用API增强图片
        const response = await fetch('/api/ai/enhance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: image.preview,
            scale,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '增强失败');
        }

        newEnhancedImages.set(image.id, data.enhancedImageUrl);
        setEnhancedImages(new Map(newEnhancedImages));

        if (onEnhanced) {
          onEnhanced(image.id, data.enhancedImageUrl);
        }
      } catch (err: any) {
        console.error(`增强图片失败: ${image.name}`, err);
        // 继续处理其他图片
      }
    }

    setIsEnhancing(false);

    if (newEnhancedImages.size === 0) {
      setError('所有图片增强失败，请检查API配置或稍后重试');
    }
  };

  const downloadEnhancedImage = (imageId: string) => {
    const enhancedUrl = enhancedImages.get(imageId);
    if (!enhancedUrl) return;

    const image = imagesToEnhance.find((img) => img.id === imageId);
    const link = document.createElement('a');
    link.href = enhancedUrl;
    link.download = `enhanced-${image?.name || 'image.png'}`;
    link.click();
  };

  const downloadAllEnhanced = () => {
    enhancedImages.forEach((enhancedUrl, imageId) => {
      downloadEnhancedImage(imageId);
    });
  };

  const showPreview = (imageId: string) => {
    const image = imagesToEnhance.find((img) => img.id === imageId);
    const enhancedUrl = enhancedImages.get(imageId);

    if (image && enhancedUrl) {
      setPreviewImage({
        original: image.preview,
        enhanced: enhancedUrl,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI图片增强</h3>
          <p className="text-sm text-gray-600">使用AI提升图片质量和清晰度</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 图片选择提示 */}
        {imagesToEnhance.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
            请先选择要增强的图片
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            已选择 {imagesToEnhance.length} 张图片
          </div>
        )}

        {/* 缩放倍数选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            增强倍数（分辨率提升）
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                disabled={isEnhancing}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  scale === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {s}x
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            倍数越高，图片质量越好，但处理时间越长
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 增强按钮 */}
        <button
          onClick={enhanceImages}
          disabled={isEnhancing || imagesToEnhance.length === 0}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在增强 {currentImageIndex + 1}/{imagesToEnhance.length}...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              开始增强
            </>
          )}
        </button>

        {/* 进度条 */}
        {isEnhancing && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                style={{ width: `${((currentImageIndex + 1) / imagesToEnhance.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 增强结果 */}
        {enhancedImages.size > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                增强完成 ({enhancedImages.size}/{imagesToEnhance.length})
              </h4>
              {enhancedImages.size > 1 && (
                <button
                  onClick={downloadAllEnhanced}
                  className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  全部下载
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {imagesToEnhance.map((image) => {
                const enhancedUrl = enhancedImages.get(image.id);
                return (
                  <div
                    key={image.id}
                    className="relative group border-2 border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={enhancedUrl || image.preview}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    {enhancedUrl ? (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={() => showPreview(image.id)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                          title="预览对比"
                        >
                          <ZoomIn className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => downloadEnhancedImage(image.id)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                          title="下载"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                          等待处理
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 使用提示 */}
        {!isEnhancing && enhancedImages.size === 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 使用提示</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• AI增强可以提升图片清晰度，让模糊图片变高清</li>
              <li>• 建议使用2x倍数，平衡质量和处理时间</li>
              <li>• 处理时间取决于图片大小和倍数，请耐心等待</li>
              <li>• 需要配置Replicate API Token才能使用此功能</li>
            </ul>
          </div>
        )}
      </div>

      {/* 预览对比模态框 */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">对比预览</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">原图</h4>
                <img
                  src={previewImage.original}
                  alt="原图"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  增强后 ({scale}x)
                </h4>
                <img
                  src={previewImage.enhanced}
                  alt="增强后"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
