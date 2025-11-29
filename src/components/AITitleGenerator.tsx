'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, RefreshCw } from 'lucide-react';

interface AITitleGeneratorProps {
  onSelectTitle?: (title: string) => void;
}

export function AITitleGenerator({ onSelectTitle }: AITitleGeneratorProps) {
  const [imageDescription, setImageDescription] = useState('');
  const [platform, setPlatform] = useState('default');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { value: 'default', label: '通用' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'wechat', label: '微信视频号' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'xiaohongshu', label: '小红书' },
    { value: 'twitter', label: 'Twitter/X' },
  ];

  const generateTitles = async () => {
    if (!imageDescription.trim()) {
      setError('请输入图片内容描述');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTitles([]);

    try {
      const response = await fetch('/api/ai/title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDescription: imageDescription.trim(),
          platform,
          keywords: keywords.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setTitles(data.titles || []);
    } catch (err: any) {
      console.error('生成标题失败:', err);
      setError(err.message || '生成标题失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTitle = (title: string, index: number) => {
    setSelectedTitle(title);
    if (onSelectTitle) {
      onSelectTitle(title);
    }
  };

  const handleCopyTitle = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI标题生成器</h3>
          <p className="text-sm text-gray-600">使用AI为你的内容生成吸引人的标题</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 图片描述输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            图片内容描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="例如：一只可爱的小猫在阳光下打盹，周围有鲜花..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
        </div>

        {/* 平台选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标平台
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {platforms.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 关键词输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            关键词（可选）
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="例如：萌宠, 治愈, 日常"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 生成按钮 */}
        <button
          onClick={generateTitles}
          disabled={isGenerating || !imageDescription.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在生成...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成标题
            </>
          )}
        </button>

        {/* 生成的标题列表 */}
        {titles.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">生成的标题</h4>
              <button
                onClick={generateTitles}
                disabled={isGenerating}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                重新生成
              </button>
            </div>
            {titles.map((title, index) => (
              <div
                key={index}
                className={`group relative p-4 border-2 rounded-lg transition cursor-pointer ${
                  selectedTitle === title
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectTitle(title, index)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-gray-900">{title}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyTitle(title, index);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition"
                    title="复制标题"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {selectedTitle === title && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 提示信息 */}
        {titles.length === 0 && !isGenerating && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 使用提示</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 详细描述图片内容，AI会生成更精准的标题</li>
              <li>• 选择目标平台，AI会根据平台特点优化标题</li>
              <li>• 添加关键词可以让标题更贴合你的需求</li>
              <li>• 点击标题即可选中，点击复制按钮可快速复制</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
