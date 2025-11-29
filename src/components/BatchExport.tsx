'use client';

import { useState } from 'react';
import { Download, Package, Loader2, Check, X } from 'lucide-react';
import { useImageStore } from '@/lib/store';
import JSZip from 'jszip';

interface BatchExportProps {
  onClose: () => void;
}

export function BatchExport({ onClose }: BatchExportProps) {
  const images = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png');
  const [quality, setQuality] = useState(0.9);
  const [includeOriginal, setIncludeOriginal] = useState(false);

  const imagesToExport = selectedImageIds.length > 0
    ? images.filter((img) => selectedImageIds.includes(img.id))
    : images;

  const handleExport = async () => {
    if (imagesToExport.length === 0) {
      alert('没有可导出的图片');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder('watermarked-images');

      if (!folder) {
        throw new Error('无法创建ZIP文件夹');
      }

      for (let i = 0; i < imagesToExport.length; i++) {
        const image = imagesToExport[i];
        setProgress(Math.round(((i + 1) / imagesToExport.length) * 100));

        // 导出处理后的图片（如果有水印）
        if (image.watermarkedPreview) {
          const response = await fetch(image.watermarkedPreview);
          const blob = await response.blob();
          const fileName = `${image.name.replace(/\.[^/.]+$/, '')}_watermarked.${exportFormat}`;
          folder.file(fileName, blob);
        }

        // 导出原图（如果选中）
        if (includeOriginal) {
          const response = await fetch(image.preview);
          const blob = await response.blob();
          const fileName = `${image.name.replace(/\.[^/.]+$/, '')}_original.${exportFormat}`;
          folder.file(fileName, blob);
        }

        // 如果既没有水印也没选择导出原图，则导出原图
        if (!image.watermarkedPreview && !includeOriginal) {
          const response = await fetch(image.preview);
          const blob = await response.blob();
          folder.file(image.name, blob);
        }
      }

      // 生成ZIP文件
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6,
        },
      });

      // 下载ZIP文件
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `watermarked-images-${Date.now()}.zip`;
      link.click();

      setProgress(100);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">批量导出</h2>
              <p className="text-sm text-gray-600">
                将 {imagesToExport.length} 张图片打包下载
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 导出格式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出格式
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('png')}
                disabled={isExporting}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition ${
                  exportFormat === 'png'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                PNG（无损）
              </button>
              <button
                onClick={() => setExportFormat('jpg')}
                disabled={isExporting}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition ${
                  exportFormat === 'jpg'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                JPG（小文件）
              </button>
            </div>
          </div>

          {/* JPG质量 */}
          {exportFormat === 'jpg' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  图片质量
                </label>
                <span className="text-sm text-gray-600">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={isExporting}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>小文件</span>
                <span>高质量</span>
              </div>
            </div>
          )}

          {/* 包含原图 */}
          <div>
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={includeOriginal}
                onChange={(e) => setIncludeOriginal(e.target.checked)}
                disabled={isExporting}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">同时导出原图</p>
                <p className="text-xs text-gray-500">
                  在ZIP中包含未处理的原始图片
                </p>
              </div>
            </label>
          </div>

          {/* 进度条 */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">导出进度</span>
                <span className="text-gray-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 文件统计 */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>将导出：</strong>
              {imagesToExport.filter((img) => img.watermarkedPreview).length > 0 && (
                <span className="ml-2">
                  {imagesToExport.filter((img) => img.watermarkedPreview).length} 张处理后图片
                </span>
              )}
              {includeOriginal && (
                <span className="ml-2">+ {imagesToExport.length} 张原图</span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || imagesToExport.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                导出中...
              </>
            ) : progress === 100 ? (
              <>
                <Check className="w-4 h-4" />
                完成
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                开始导出
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
