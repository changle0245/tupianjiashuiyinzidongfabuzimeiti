'use client';

import { useState, useRef, useEffect } from 'react';
import { Sun, Contrast as ContrastIcon, Droplet, RotateCcw, Check, X } from 'lucide-react';
import { UploadedImage } from '@/types/image';

interface ImageFiltersProps {
  image: UploadedImage;
  onSave: (filteredImageUrl: string) => void;
  onClose: () => void;
}

interface FilterState {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  blur: number; // 0 to 10
  grayscale: number; // 0 to 100
}

const defaultFilters: FilterState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grayscale: 0,
};

export function ImageFilters({ image, onSave, onClose }: ImageFiltersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 加载原始图片
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.preview;

    img.onload = () => {
      originalImageRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      setImageLoaded(true);
      applyFilters(defaultFilters);
    };
  }, [image]);

  // 应用滤镜
  const applyFilters = (filterState: FilterState) => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 应用CSS滤镜
    const cssFilters = [
      `brightness(${100 + filterState.brightness}%)`,
      `contrast(${100 + filterState.contrast}%)`,
      `saturate(${100 + filterState.saturation}%)`,
      `blur(${filterState.blur}px)`,
      `grayscale(${filterState.grayscale}%)`,
    ].join(' ');

    ctx.filter = cssFilters;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
  };

  // 更新滤镜时重新渲染
  useEffect(() => {
    if (imageLoaded) {
      applyFilters(filters);
    }
  }, [filters, imageLoaded]);

  const handleFilterChange = (filterName: keyof FilterState, value: number) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const filteredImageUrl = canvas.toDataURL('image/png', 1.0);
    onSave(filteredImageUrl);
  };

  const presets = [
    { name: '原图', filters: defaultFilters },
    {
      name: '复古',
      filters: { brightness: -10, contrast: 20, saturation: -30, blur: 0, grayscale: 0 },
    },
    {
      name: '黑白',
      filters: { brightness: 0, contrast: 10, saturation: 0, blur: 0, grayscale: 100 },
    },
    {
      name: '鲜艳',
      filters: { brightness: 10, contrast: 15, saturation: 40, blur: 0, grayscale: 0 },
    },
    {
      name: '柔和',
      filters: { brightness: 5, contrast: -10, saturation: -20, blur: 1, grayscale: 0 },
    },
    {
      name: '高对比',
      filters: { brightness: 0, contrast: 40, saturation: 10, blur: 0, grayscale: 0 },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">滤镜和调色</h2>
            <p className="text-sm text-gray-600">{image.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Canvas Area */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-8 overflow-auto">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full shadow-2xl"
              style={{ imageRendering: 'high-quality' }}
            />
          </div>

          {/* Controls Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Presets */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">预设滤镜</h3>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setFilters(preset.filters)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6"></div>

              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Sun className="w-4 h-4" />
                    亮度
                  </label>
                  <span className="text-sm text-gray-600">{filters.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filters.brightness}
                  onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ContrastIcon className="w-4 h-4" />
                    对比度
                  </label>
                  <span className="text-sm text-gray-600">{filters.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filters.contrast}
                  onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Droplet className="w-4 h-4" />
                    饱和度
                  </label>
                  <span className="text-sm text-gray-600">{filters.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filters.saturation}
                  onChange={(e) => handleFilterChange('saturation', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">模糊</label>
                  <span className="text-sm text-gray-600">{filters.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.blur}
                  onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">灰度</label>
                  <span className="text-sm text-gray-600">{filters.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) => handleFilterChange('grayscale', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!imageLoaded}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            应用滤镜
          </button>
        </div>
      </div>
    </div>
  );
}
