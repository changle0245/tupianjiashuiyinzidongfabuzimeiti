'use client';

import { useState } from 'react';
import { FileText, Copy, Check, Loader2, RefreshCw } from 'lucide-react';

interface AIDescriptionGeneratorProps {
  onSelectDescription?: (description: string) => void;
}

export function AIDescriptionGenerator({ onSelectDescription }: AIDescriptionGeneratorProps) {
  const [imageDescription, setImageDescription] = useState('');
  const [platform, setPlatform] = useState('default');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isCopied, setIsCopied] = useState(false);
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

  const tones = [
    { value: 'professional', label: '专业正式' },
    { value: 'casual', label: '轻松随意' },
    { value: 'enthusiastic', label: '热情活力' },
    { value: 'informative', label: '信息丰富' },
    { value: 'humorous', label: '幽默有趣' },
  ];

  const generateDescription = async () => {
    if (!imageDescription.trim()) {
      setError('请输入图片内容描述');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedDescription('');

    try {
      const response = await fetch('/api/ai/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDescription: imageDescription.trim(),
          platform,
          keywords: keywords.trim() || undefined,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setGeneratedDescription(data.description || '');
      if (onSelectDescription) {
        onSelectDescription(data.description || '');
      }
    } catch (err: any) {
      console.error('生成描述失败:', err);
      setError(err.message || '生成描述失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleEditDescription = (newText: string) => {
    setGeneratedDescription(newText);
    if (onSelectDescription) {
      onSelectDescription(newText);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI描述生成器</h3>
          <p className="text-sm text-gray-600">使用AI为你的内容生成详细的描述</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 平台选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标平台
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 语气风格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语气风格
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tones.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onClick={generateDescription}
          disabled={isGenerating || !imageDescription.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在生成...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              生成描述
            </>
          )}
        </button>

        {/* 生成的描述 */}
        {generatedDescription && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">生成的描述</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={generateDescription}
                  disabled={isGenerating}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新生成
                </button>
                <button
                  onClick={handleCopyDescription}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  title="复制描述"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={generatedDescription}
                onChange={(e) => handleEditDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 resize-none"
                rows={8}
              />
              <p className="text-xs text-gray-500 mt-2">
                可以直接编辑生成的描述，修改后的内容会自动保存
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>字数: {generatedDescription.length}</span>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {!generatedDescription && !isGenerating && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 使用提示</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 详细描述图片内容，AI会生成更精准的描述</li>
              <li>• 选择目标平台，AI会根据平台特点优化描述长度和风格</li>
              <li>• 选择合适的语气风格，让描述更贴合你的品牌调性</li>
              <li>• 生成后可以直接编辑修改，让描述更完美</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
