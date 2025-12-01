'use client';

import { useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { Wand2, Check, X, Download, Loader2 } from 'lucide-react';
import { useImageStore } from '@/lib/store';
import { UploadedImage } from '@/types/image';

interface BatchWatermarkProps {
  onClose: () => void;
}

export function BatchWatermark({ onClose }: BatchWatermarkProps) {
  const images = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);
  const watermarkTemplate = useImageStore((state) => state.watermarkTemplate);
  const addProcessedImage = useImageStore((state) => state.addProcessedImage);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [results, setResults] = useState<Array<{ id: string; success: boolean; dataUrl?: string }>>([]);

  const selectedImages = images.filter((img) => selectedImageIds.includes(img.id));

  // 批量应用水印
  const applyWatermarkBatch = useCallback(async () => {
    if (!watermarkTemplate || selectedImages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    setFailedCount(0);
    setResults([]);

    const newResults: Array<{ id: string; success: boolean; dataUrl?: string }> = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];

      try {
        // 创建Canvas处理图片
        const dataUrl = await processImage(image, watermarkTemplate.canvasJSON);

        newResults.push({
          id: image.id,
          success: true,
          dataUrl,
        });

        // 保存处理后的图片
        addProcessedImage(image.id, dataUrl);

        setProcessedCount((prev) => prev + 1);
      } catch (error) {
        console.error(`处理图片失败: ${image.name}`, error);
        newResults.push({
          id: image.id,
          success: false,
        });
        setFailedCount((prev) => prev + 1);
      }

      // 更新进度
      setProgress(((i + 1) / selectedImages.length) * 100);
    }

    setResults(newResults);
    setIsProcessing(false);
  }, [watermarkTemplate, selectedImages, addProcessedImage]);

  // 处理单张图片
  const processImage = async (image: UploadedImage, templateJSON: string): Promise<string> => {
    // 创建临时Canvas
    const tempCanvas = new fabric.Canvas(document.createElement('canvas'));

    try {
      // 加载图片 - 使用 Promise 风格
      const img = await fabric.Image.fromURL(image.preview);

      if (!img) {
        throw new Error('无法加载图片');
      }

      // 设置Canvas大小为图片原始大小
      tempCanvas.setWidth(img.width || 800);
      tempCanvas.setHeight(img.height || 600);

      // 添加背景图片
      img.set({
        selectable: false,
        evented: false,
      });

      tempCanvas.add(img);
      tempCanvas.sendObjectToBack(img);

      // 加载水印模板
      const templateData = JSON.parse(templateJSON);

      // 只加载水印对象（跳过背景图）
      if (templateData.objects) {
        for (const obj of templateData.objects) {
          // 跳过背景图片对象
          if (obj.selectable === false) continue;

          // 根据对象类型创建实例 - 使用 Promise 风格
          const objects = await fabric.util.enlivenObjects([obj]);
          objects.forEach((o) => {
            tempCanvas.add(o);
          });
        }
      }

      // 等待渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));
      tempCanvas.renderAll();

      // 导出为DataURL
      const dataUrl = tempCanvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      // 清理
      tempCanvas.dispose();

      return dataUrl;
    } catch (error) {
      tempCanvas.dispose();
      throw error;
    }
  };

  // 批量下载
  const downloadAll = () => {
    results.forEach((result, index) => {
      if (result.success && result.dataUrl) {
        const link = document.createElement('a');
        const image = selectedImages.find((img) => img.id === result.id);
        link.download = `watermarked-${image?.name || `image-${index + 1}`}`;
        link.href = result.dataUrl;
        link.click();
      }
    });
  };

  if (!watermarkTemplate) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              还没有保存水印模板
            </h3>
            <p className="text-gray-600 mb-6">
              请先在水印编辑器中创建并保存一个水印模板，然后再使用批量应用功能。
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">批量应用水印</h3>
            <p className="text-gray-600 mt-1">
              将水印应用到 {selectedImages.length} 张选中的图片
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 水印模板预览 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">当前水印模板</h4>
            <p className="text-sm text-gray-600">
              {watermarkTemplate.name}
            </p>
            {watermarkTemplate.thumbnail && (
              <img
                src={watermarkTemplate.thumbnail}
                alt="水印预览"
                className="mt-2 max-h-40 rounded border border-gray-200"
              />
            )}
          </div>

          {/* 选中的图片列表 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              将处理的图片 ({selectedImages.length})
            </h4>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {selectedImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    alt={img.name}
                    className="w-full h-20 object-cover rounded border border-gray-200"
                  />
                  {results.find((r) => r.id === img.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                      {results.find((r) => r.id === img.id)?.success ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 进度条 */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">处理进度</span>
                <span className="font-medium text-gray-900">
                  {processedCount + failedCount} / {selectedImages.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 处理结果 */}
          {results.length > 0 && !isProcessing && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">处理完成！</h4>
                  <p className="text-sm text-green-700">
                    成功: {processedCount} 张
                    {failedCount > 0 && `, 失败: ${failedCount} 张`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {!isProcessing && results.length === 0 && (
              <button
                onClick={applyWatermarkBatch}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                开始批量处理
              </button>
            )}

            {isProcessing && (
              <button
                disabled
                className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                处理中...
              </button>
            )}

            {results.length > 0 && !isProcessing && (
              <>
                <button
                  onClick={downloadAll}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载全部 ({processedCount})
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  完成
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
