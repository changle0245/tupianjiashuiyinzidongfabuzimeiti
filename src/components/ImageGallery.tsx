'use client';

import Image from 'next/image';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { useImageStore } from '@/lib/store';
import { UploadedImage } from '@/types/image';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

interface ImageCardProps {
  image: UploadedImage;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function ImageCard({ image, isSelected, onSelect, onRemove }: ImageCardProps) {
  return (
    <div
      className={`
        group relative bg-white rounded-lg overflow-hidden shadow-sm
        transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'ring-2 ring-blue-500 shadow-lg scale-105'
          : 'hover:shadow-md hover:scale-102'
        }
      `}
      onClick={onSelect}
    >
      {/* 选中标记 */}
      <div className={`
        absolute top-2 left-2 z-10 w-6 h-6 rounded-full
        flex items-center justify-center transition-all
        ${isSelected
          ? 'bg-blue-500 scale-100'
          : 'bg-white/80 scale-0 group-hover:scale-100'
        }
      `}>
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* 删除按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={`
          absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full
          transition-all opacity-0 group-hover:opacity-100
          hover:bg-red-600 hover:scale-110
        `}
      >
        <X className="w-4 h-4" />
      </button>

      {/* 图片预览 */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={image.preview}
          alt={image.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* 图片信息 */}
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-gray-900 truncate" title={image.name}>
          {image.name}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(image.size)}</span>
          <span className="uppercase">{image.type.split('/')[1]}</span>
        </div>
      </div>

      {/* 选中覆盖层 */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
      )}
    </div>
  );
}

export function ImageGallery() {
  const images = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);
  const removeImage = useImageStore((state) => state.removeImage);
  const selectImage = useImageStore((state) => state.selectImage);
  const deselectImage = useImageStore((state) => state.deselectImage);
  const selectAllImages = useImageStore((state) => state.selectAllImages);
  const clearSelection = useImageStore((state) => state.clearSelection);
  const clearImages = useImageStore((state) => state.clearImages);

  const toggleSelect = (id: string) => {
    if (selectedImageIds.includes(id)) {
      deselectImage(id);
    } else {
      selectImage(id);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          还没有上传图片
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          上传图片后，它们会显示在这里。你可以批量选择、编辑和管理你的图片。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {images.length} 张图片
            {selectedImageIds.length > 0 && (
              <span className="ml-2 text-blue-600">
                ({selectedImageIds.length} 已选中)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedImageIds.length === 0 ? (
            <button
              onClick={selectAllImages}
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            >
              全选
            </button>
          ) : (
            <>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
              >
                取消选择
              </button>
              <button
                onClick={() => {
                  selectedImageIds.forEach(id => removeImage(id));
                  clearSelection();
                }}
                className="px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition"
              >
                删除选中 ({selectedImageIds.length})
              </button>
            </>
          )}

          <button
            onClick={clearImages}
            className="px-3 py-1.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition"
          >
            清空全部
          </button>
        </div>
      </div>

      {/* 图片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImageIds.includes(image.id)}
            onSelect={() => toggleSelect(image.id)}
            onRemove={() => removeImage(image.id)}
          />
        ))}
      </div>

      {/* 批量操作提示 */}
      {selectedImageIds.length > 1 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 已选中 {selectedImageIds.length} 张图片，你可以批量添加水印或进行其他操作
          </p>
        </div>
      )}
    </div>
  );
}
