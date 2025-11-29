'use client';

import { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  Calendar,
  Image as ImageIcon,
  MoreVertical
} from 'lucide-react';
import { PublishTask, PublishStatus } from '@/types/image';
import { usePublishStore, useImageStore } from '@/lib/store';
import { getPlatformIcon, getPlatformName } from '@/lib/platforms';

interface PublishQueueProps {
  onEditTask?: (task: PublishTask) => void;
}

export function PublishQueue({ onEditTask }: PublishQueueProps) {
  const tasks = usePublishStore((state) => state.tasks);
  const removeTask = usePublishStore((state) => state.removeTask);
  const updateTask = usePublishStore((state) => state.updateTask);
  const images = useImageStore((state) => state.images);

  const [filterStatus, setFilterStatus] = useState<PublishStatus | 'all'>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const statusConfig: Record<PublishStatus, { label: string; color: string; icon: any }> = {
    draft: { label: '草稿', color: 'gray', icon: Edit },
    scheduled: { label: '已调度', color: 'blue', icon: Clock },
    publishing: { label: '发布中', color: 'yellow', icon: Play },
    published: { label: '已发布', color: 'green', icon: CheckCircle },
    failed: { label: '失败', color: 'red', icon: XCircle },
    cancelled: { label: '已取消', color: 'gray', icon: Pause },
  };

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter((task) => task.status === filterStatus);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 按发布时间排序（最近的在前）
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
  });

  const handleDeleteTask = (taskId: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      removeTask(taskId);
    }
  };

  const handleCancelTask = (taskId: string) => {
    if (confirm('确定要取消这个任务吗？')) {
      updateTask(taskId, { status: 'cancelled' });
    }
  };

  const getTaskImages = (task: PublishTask) => {
    return images.filter((img) => task.imageIds.includes(img.id));
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = new Date(date).getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (diff < 0) {
      return '已过期';
    } else if (minutes < 60) {
      return `${minutes}分钟后`;
    } else if (hours < 24) {
      return `${hours}小时后`;
    } else {
      return `${days}天后`;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">发布队列</h3>

        {/* 状态筛选 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部 ({tasks.length})
          </button>
          {(Object.keys(statusConfig) as PublishStatus[]).map((status) => {
            const count = tasks.filter((t) => t.status === status).length;
            const config = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? `bg-${config.color}-500 text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 任务列表 */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            {filterStatus === 'all' ? '暂无发布任务' : `暂无${statusConfig[filterStatus]?.label}任务`}
          </p>
          <p className="text-sm text-gray-400">
            创建一个新任务开始发布内容到社交媒体
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => {
            const config = statusConfig[task.status];
            const StatusIcon = config.icon;
            const taskImages = getTaskImages(task);
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                {/* 任务头部 */}
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* 图片预览 */}
                    <div className="flex-shrink-0">
                      {taskImages.length > 0 ? (
                        <div className="relative">
                          <img
                            src={taskImages[0].watermarkedPreview || taskImages[0].preview}
                            alt={task.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          {taskImages.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                              +{taskImages.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* 任务信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg truncate">
                          {task.title}
                        </h4>
                        <div className={`flex items-center gap-1 px-3 py-1 bg-${config.color}-100 text-${config.color}-700 rounded-full text-sm font-medium whitespace-nowrap`}>
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      {/* 平台标签 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {task.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            <span>{getPlatformIcon(platform)}</span>
                            {getPlatformName(platform)}
                          </span>
                        ))}
                      </div>

                      {/* 时间信息 */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.isImmediate ? '立即发布' : formatDateTime(task.publishTime)}
                        </div>
                        {!task.isImmediate && task.status === 'scheduled' && (
                          <div className="text-blue-600 font-medium">
                            {getRelativeTime(task.publishTime)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2">
                      {task.status === 'draft' && onEditTask && (
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="编辑"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      {(task.status === 'scheduled' || task.status === 'draft') && (
                        <button
                          onClick={() => handleCancelTask(task.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="取消"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="删除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="更多"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* 展开的详细信息 */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* 图片列表 */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            图片 ({taskImages.length})
                          </h5>
                          <div className="grid grid-cols-4 gap-2">
                            {taskImages.map((image) => (
                              <img
                                key={image.id}
                                src={image.watermarkedPreview || image.preview}
                                alt={image.name}
                                className="w-full h-16 object-cover rounded border border-gray-200"
                              />
                            ))}
                          </div>
                        </div>

                        {/* 发布结果 */}
                        {task.platformResults && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              发布结果
                            </h5>
                            <div className="space-y-2">
                              {Object.entries(task.platformResults).map(([platform, result]) => (
                                <div
                                  key={platform}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {getPlatformIcon(platform as any)} {getPlatformName(platform as any)}
                                  </span>
                                  {result.success ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      成功
                                    </span>
                                  ) : (
                                    <span className="text-red-600 flex items-center gap-1">
                                      <XCircle className="w-4 h-4" />
                                      失败
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 错误信息 */}
                      {task.error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>错误：</strong> {task.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
