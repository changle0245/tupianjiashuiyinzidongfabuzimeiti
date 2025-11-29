'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UploadedImage } from '@/types/image';

interface ImageCompareProps {
  image: UploadedImage;
  onClose: () => void;
}

export function ImageCompare({ image, onClose }: ImageCompareProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const hasWatermark = !!image.watermarkedPreview;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  if (!hasWatermark) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">无法对比</h2>
          <p className="text-gray-600 mb-6">
            该图片还没有添加水印，无法进行对比
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">对比预览</h2>
          <p className="text-sm text-gray-400">{image.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Compare Container */}
      <div className="w-full max-w-6xl flex-1 flex items-center justify-center">
        <div
          className="relative w-full h-full max-h-[70vh] select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
            {/* 处理后的图片（右侧） */}
            <img
              src={image.watermarkedPreview}
              alt="处理后"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />

            {/* 原图（左侧，被剪裁） */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={image.preview}
                alt="原图"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ width: `${(100 / sliderPosition) * 100}%` }}
                draggable={false}
              />
            </div>

            {/* 分割线 */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* 分割线手柄 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-gray-700 absolute left-1" />
                <ChevronRight className="w-4 h-4 text-gray-700 absolute right-1" />
              </div>
            </div>

            {/* 标签 */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg backdrop-blur-sm">
              原图
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg backdrop-blur-sm">
              处理后
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-6xl mt-4 text-center">
        <p className="text-sm text-gray-400">
          拖动中间的滑块来对比原图和处理后的图片
        </p>
      </div>
    </div>
  );
}
