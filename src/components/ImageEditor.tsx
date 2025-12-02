'use client';

import { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Download,
  X,
  Check,
  Undo,
} from 'lucide-react';
import { UploadedImage } from '@/types/image';

interface ImageEditorProps {
  image: UploadedImage;
  onSave: (editedImageUrl: string) => void;
  onClose: () => void;
}

interface EditState {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  crop: { x: number; y: number; width: number; height: number } | null;
}

export function ImageEditor({ image, onSave, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editState, setEditState] = useState<EditState>({
    rotation: 0,
    flipH: false,
    flipV: false,
    crop: null,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [history, setHistory] = useState<EditState[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 加载并渲染图片
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.preview;

    img.onload = () => {
      // 根据旋转角度调整canvas尺寸
      const isRotated = editState.rotation === 90 || editState.rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      // 清空canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 保存当前状态
      ctx.save();

      // 移动到中心点
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // 旋转
      ctx.rotate((editState.rotation * Math.PI) / 180);

      // 翻转
      const scaleX = editState.flipH ? -1 : 1;
      const scaleY = editState.flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      // 绘制图片
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

      // 恢复状态
      ctx.restore();

      setImageLoaded(true);
    };
  }, [image, editState]);

  const handleRotate = () => {
    // 保存当前状态到历史
    setHistory([...history, editState]);

    setEditState({
      ...editState,
      rotation: (editState.rotation + 90) % 360,
    });
  };

  const handleFlipHorizontal = () => {
    setHistory([...history, editState]);
    setEditState({
      ...editState,
      flipH: !editState.flipH,
    });
  };

  const handleFlipVertical = () => {
    setHistory([...history, editState]);
    setEditState({
      ...editState,
      flipV: !editState.flipV,
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setEditState(previousState);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedImageUrl = canvas.toDataURL('image/png', 1.0);
    onSave(editedImageUrl);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `edited-${image.name}`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">图片编辑</h2>
            <p className="text-sm text-gray-600">{image.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRotate}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              title="旋转90度"
            >
              <RotateCw className="w-4 h-4" />
              旋转
            </button>
            <button
              onClick={handleFlipHorizontal}
              className={`px-4 py-2 border ${
                editState.flipH
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              } rounded-lg hover:bg-blue-50 transition flex items-center gap-2`}
              title="水平翻转"
            >
              <FlipHorizontal className="w-4 h-4" />
              水平翻转
            </button>
            <button
              onClick={handleFlipVertical}
              className={`px-4 py-2 border ${
                editState.flipV
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              } rounded-lg hover:bg-blue-50 transition flex items-center gap-2`}
              title="垂直翻转"
            >
              <FlipVertical className="w-4 h-4" />
              垂直翻转
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="撤销"
            >
              <Undo className="w-4 h-4" />
              撤销 ({history.length})
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-8">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full shadow-2xl"
          />
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {editState.rotation > 0 && (
              <span className="mr-4">旋转: {editState.rotation}°</span>
            )}
            {editState.flipH && <span className="mr-4">水平翻转 ✓</span>}
            {editState.flipV && <span className="mr-4">垂直翻转 ✓</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载
            </button>
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
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
