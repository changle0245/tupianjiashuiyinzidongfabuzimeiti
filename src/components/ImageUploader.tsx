'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useImageStore } from '@/lib/store';
import { UploadedImage } from '@/types/image';

export function ImageUploader() {
  const addImages = useImageStore((state) => state.addImages);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadStatus('uploading');
    setErrorMessage('');

    // 处理被拒绝的文件
    if (rejectedFiles.length > 0) {
      const reasons = rejectedFiles.map(({ file, errors }) => {
        const errorMsg = errors.map((e: any) => {
          if (e.code === 'file-too-large') return `${file.name}: 文件太大（最大10MB）`;
          if (e.code === 'file-invalid-type') return `${file.name}: 不支持的文件类型`;
          return `${file.name}: ${e.message}`;
        }).join(', ');
        return errorMsg;
      }).join('; ');

      setErrorMessage(reasons);
      setUploadStatus('error');

      // 3秒后清除错误
      setTimeout(() => {
        setUploadStatus('idle');
        setErrorMessage('');
      }, 3000);
    }

    // 处理接受的文件
    if (acceptedFiles.length > 0) {
      const newImages: UploadedImage[] = acceptedFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));

      addImages(newImages);
      setUploadStatus('success');

      // 2秒后重置状态
      setTimeout(() => {
        setUploadStatus('idle');
      }, 2000);
    }
  }, [addImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : uploadStatus === 'success'
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {/* 图标 */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-colors
            ${uploadStatus === 'success'
              ? 'bg-green-100'
              : uploadStatus === 'error'
              ? 'bg-red-100'
              : 'bg-blue-100'
            }
          `}>
            {uploadStatus === 'uploading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {uploadStatus === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {uploadStatus === 'error' && (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
            {uploadStatus === 'idle' && (
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
          </div>

          {/* 文字提示 */}
          <div>
            <p className="text-lg font-medium text-gray-700 mb-1">
              {uploadStatus === 'uploading' && '正在上传...'}
              {uploadStatus === 'success' && '上传成功！'}
              {uploadStatus === 'error' && '上传失败'}
              {uploadStatus === 'idle' && (isDragActive
                ? '放开以上传图片'
                : '拖拽图片到这里，或点击选择'
              )}
            </p>
            {uploadStatus === 'idle' && (
              <p className="text-sm text-gray-500">
                支持 JPG、PNG、WebP、GIF，单个文件最大 10MB
              </p>
            )}
            {uploadStatus === 'error' && (
              <p className="text-sm text-red-600 mt-2">
                {errorMessage}
              </p>
            )}
          </div>

          {/* 快捷提示 */}
          {uploadStatus === 'idle' && (
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-200 rounded">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded">V</kbd>
                <span>粘贴</span>
              </div>
              <div className="flex items-center gap-1">
                <span>或</span>
                <span className="font-medium">拖拽文件</span>
              </div>
            </div>
          )}
        </div>

        {/* 上传进度指示器 */}
        {uploadStatus === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>支持批量上传</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>自动去重</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>实时预览</span>
        </div>
      </div>
    </div>
  );
}
