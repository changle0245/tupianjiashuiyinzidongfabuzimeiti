'use client';

import { useState } from 'react';
import { Bookmark, Trash2, Edit2, Check, X, Plus } from 'lucide-react';
import { useImageStore } from '@/lib/store';
import { WatermarkTemplate } from '@/types/image';

interface TemplateLibraryProps {
  onSelectTemplate?: (template: WatermarkTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const watermarkTemplates = useImageStore((state) => state.watermarkTemplates);
  const currentTemplate = useImageStore((state) => state.watermarkTemplate);
  const setWatermarkTemplate = useImageStore((state) => state.setWatermarkTemplate);
  const updateWatermarkTemplate = useImageStore((state) => state.updateWatermarkTemplate);
  const removeWatermarkTemplate = useImageStore((state) => state.removeWatermarkTemplate);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSelectTemplate = (template: WatermarkTemplate) => {
    setWatermarkTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleStartEdit = (template: WatermarkTemplate) => {
    setEditingId(template.id);
    setEditingName(template.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updateWatermarkTemplate(id, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      removeWatermarkTemplate(id);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">模板库</h3>
            <p className="text-sm text-gray-600">
              已保存 {watermarkTemplates.length} 个水印模板
            </p>
          </div>
        </div>
      </div>

      {watermarkTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">还没有保存任何水印模板</p>
          <p className="text-sm text-gray-400">
            在水印编辑器中点击"保存模板"按钮来保存你的水印设计
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watermarkTemplates.map((template) => (
            <div
              key={template.id}
              className={`group relative border-2 rounded-lg overflow-hidden transition cursor-pointer ${
                currentTemplate?.id === template.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              {/* 缩略图 */}
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-32 object-cover bg-gray-100"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* 选中标记 */}
              {currentTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* 模板信息 */}
              <div className="p-3 bg-white">
                {editingId === template.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit(template.id);
                      }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </>
                )}
              </div>

              {/* 操作按钮 */}
              {editingId !== template.id && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(template);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                    title="重命名"
                  >
                    <Edit2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(template.id);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {watermarkTemplates.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>提示：</strong>点击模板卡片来加载该水印设计到编辑器中
          </p>
        </div>
      )}
    </div>
  );
}
