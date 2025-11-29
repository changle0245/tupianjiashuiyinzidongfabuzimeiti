'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Wand2, X, Send, Download, Palette, Edit3, Bookmark, Maximize } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageGallery } from '@/components/ImageGallery';
import { WatermarkEditor } from '@/components/WatermarkEditor';
import { BatchWatermark } from '@/components/BatchWatermark';
import { AITitleGenerator } from '@/components/AITitleGenerator';
import { AIDescriptionGenerator } from '@/components/AIDescriptionGenerator';
import { AIImageEnhancer } from '@/components/AIImageEnhancer';
import { PublishQueue } from '@/components/PublishQueue';
import { PublishTaskForm } from '@/components/PublishTaskForm';
import { ImageEditor } from '@/components/ImageEditor';
import { ImageFilters } from '@/components/ImageFilters';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { BatchExport } from '@/components/BatchExport';
import { ImageCompare } from '@/components/ImageCompare';
import { useImageStore, usePublishStore } from '@/lib/store';
import { UploadedImage, PublishTask } from '@/types/image';

export default function EditorPage() {
  const images = useImageStore((state) => state.images);
  const selectedImageIds = useImageStore((state) => state.selectedImageIds);
  const watermarkTemplate = useImageStore((state) => state.watermarkTemplate);
  const addTask = usePublishStore((state) => state.addTask);
  const updateTask = usePublishStore((state) => state.updateTask);

  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [filteringImage, setFilteringImage] = useState<UploadedImage | null>(null);
  const [comparingImage, setComparingImage] = useState<UploadedImage | null>(null);
  const [showBatchWatermark, setShowBatchWatermark] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [showPublishQueue, setShowPublishQueue] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showBatchExport, setShowBatchExport] = useState(false);
  const [editingTask, setEditingTask] = useState<PublishTask | null>(null);

  const handleCreatePublishTask = () => {
    setEditingTask(null);
    setShowPublishForm(true);
  };

  const handleEditTask = (task: PublishTask) => {
    setEditingTask(task);
    setShowPublishForm(true);
  };

  const handleSubmitTask = (task: PublishTask) => {
    if (editingTask) {
      updateTask(task.id, task);
    } else {
      addTask(task);
    }
    setShowPublishForm(false);
    setEditingTask(null);
    setShowPublishQueue(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  水
                </div>
                <h1 className="text-xl font-bold text-gray-900">图片编辑器</h1>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 flex-wrap">
              {watermarkTemplate && (
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  ✓ 已保存模板
                </div>
              )}
              <button
                onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
                className={`px-3 py-2 ${showTemplateLibrary ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2`}
              >
                <Bookmark className="w-4 h-4" />
                模板库
              </button>
              <button
                onClick={() => setShowBatchExport(true)}
                disabled={images.length === 0}
                className="px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                批量导出
              </button>
              <button
                onClick={() => setShowAIFeatures(!showAIFeatures)}
                disabled={images.length === 0}
                className={`px-3 py-2 ${showAIFeatures ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <Sparkles className="w-4 h-4" />
                AI功能
              </button>
              <button
                onClick={() => setShowPublishQueue(!showPublishQueue)}
                className={`px-3 py-2 ${showPublishQueue ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-green-500 to-teal-500'} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2`}
              >
                <Send className="w-4 h-4" />
                发布队列
              </button>
              <button
                onClick={handleCreatePublishTask}
                disabled={images.length === 0}
                className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                创建任务
              </button>
              <button
                onClick={() => setShowBatchWatermark(true)}
                disabled={selectedImageIds.length === 0}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                批量水印
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 水印编辑模式 */}
          {editingImage ? (
            <>
              {/* 返回按钮 */}
              <button
                onClick={() => setEditingImage(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                返回图片列表
              </button>

              {/* 编辑器 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    添加水印
                  </h2>
                  <p className="text-gray-600">
                    正在编辑: {editingImage.name}
                  </p>
                </div>
                <WatermarkEditor
                  image={editingImage}
                  onSave={(dataUrl) => {
                    console.log('保存水印图片:', dataUrl);
                    // TODO: 保存处理后的图片
                  }}
                />
              </div>
            </>
          ) : (
            <>
          {/* 进度指示器 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">创建流程</h2>
              <span className="text-sm text-gray-500">第 1 步，共 4 步</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-600">
              <div className="text-blue-600 font-medium">1. 上传图片</div>
              <div>2. 添加水印</div>
              <div>3. AI优化</div>
              <div>4. 发布管理</div>
            </div>
          </div>

          {/* 上传区域 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                上传你的图片
              </h2>
              <p className="text-gray-600">
                支持批量上传多张图片，我们会帮你处理所有细节
              </p>
            </div>
            <ImageUploader />
          </div>

          {/* 图片预览区域 */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  图片管理
                </h2>
                <p className="text-gray-600">
                  选择图片进行编辑，或批量处理多张图片
                </p>
              </div>
              <ImageGallery onEditImage={(image) => setEditingImage(image)} />
            </div>
          )}

          {/* AI功能区域 */}
          {showAIFeatures && images.length > 0 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🤖 AI智能助手
                </h2>
                <p className="text-gray-600">
                  使用AI为你的内容生成标题、描述，或增强图片质量
                </p>
              </div>

              {/* AI标题生成 */}
              <AITitleGenerator />

              {/* AI描述生成 */}
              <AIDescriptionGenerator />

              {/* AI图片增强 */}
              <AIImageEnhancer />
            </div>
          )}

          {/* 发布队列区域 */}
          {showPublishQueue && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  📤 发布管理
                </h2>
                <p className="text-gray-600">
                  管理你的发布任务，查看发布状态和历史记录
                </p>
              </div>

              <PublishQueue onEditTask={handleEditTask} />
            </div>
          )}

          {/* 模板库区域 */}
          {showTemplateLibrary && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🔖 水印模板库
                </h2>
                <p className="text-gray-600">
                  管理和使用你保存的水印模板
                </p>
              </div>

              <TemplateLibrary />
            </div>
          )}

          {/* 快捷操作提示 */}
          {images.length === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 快速开始指南
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h4 className="font-medium text-gray-900">上传图片</h4>
                  <p className="text-sm text-gray-600">
                    拖拽或点击上传区域，支持JPG、PNG、WebP等格式
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                    2
                  </div>
                  <h4 className="font-medium text-gray-900">添加水印</h4>
                  <p className="text-sm text-gray-600">
                    选择图片后，可以添加文字或图片水印，自由调整位置和样式
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">
                    3
                  </div>
                  <h4 className="font-medium text-gray-900">AI优化</h4>
                  <p className="text-sm text-gray-600">
                    使用AI生成标题描述，或增强图片质量
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 功能特性 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">已完成功能 ✓</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Canvas水印编辑器（可拖拽、调整大小）
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  AI智能生成标题和描述
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  图片质量增强（模糊变高清）
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  批量处理所有图片
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  发布队列管理和调度
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  图片基础编辑（旋转、翻转）
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  滤镜和调色功能
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  水印模板库管理
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  批量导出ZIP打包
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">支持的平台</h3>
              <div className="flex flex-wrap gap-2">
                {['微信视频号', 'YouTube', 'Facebook', 'Instagram', 'TikTok', 'X', '小红书'].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* 批量水印模态框 */}
      {showBatchWatermark && (
        <BatchWatermark onClose={() => setShowBatchWatermark(false)} />
      )}

      {/* 发布任务表单模态框 */}
      {showPublishForm && (
        <PublishTaskForm
          task={editingTask || undefined}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setShowPublishForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* 图片编辑器模态框 */}
      {editingImage && (
        <ImageEditor
          image={editingImage}
          onSave={(editedImageUrl) => {
            // TODO: 更新图片
            setEditingImage(null);
          }}
          onClose={() => setEditingImage(null)}
        />
      )}

      {/* 滤镜编辑器模态框 */}
      {filteringImage && (
        <ImageFilters
          image={filteringImage}
          onSave={(filteredImageUrl) => {
            // TODO: 更新图片
            setFilteringImage(null);
          }}
          onClose={() => setFilteringImage(null)}
        />
      )}

      {/* 图片对比模态框 */}
      {comparingImage && (
        <ImageCompare
          image={comparingImage}
          onClose={() => setComparingImage(null)}
        />
      )}

      {/* 批量导出模态框 */}
      {showBatchExport && (
        <BatchExport onClose={() => setShowBatchExport(false)} />
      )}
    </div>
  );
}
