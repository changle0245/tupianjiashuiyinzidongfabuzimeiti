'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { Type, Image as ImageIcon, Download, Trash2, Undo, Redo, Save } from 'lucide-react';
import { UploadedImage, WatermarkTemplate } from '@/types/image';
import { useImageStore } from '@/lib/store';

interface WatermarkEditorProps {
  image: UploadedImage;
  onSave?: (dataUrl: string) => void;
}

export function WatermarkEditor({ image, onSave }: WatermarkEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const addWatermarkTemplate = useImageStore((state) => state.addWatermarkTemplate);

  // 初始化 Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
    });

    // 加载背景图片 - 使用 async/await
    const loadImage = async () => {
      try {
        const img = await fabric.Image.fromURL(image.preview);

        if (!img) return;

        // 计算缩放比例以适应画布
        const scale = Math.min(
          fabricCanvas.width! / (img.width || 1),
          fabricCanvas.height! / (img.height || 1)
        ) * 0.9;

        img.set({
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });

        // 居中图片
        img.center();
        fabricCanvas.add(img);
        fabricCanvas.sendObjectToBack(img);
        fabricCanvas.renderAll();

        // 保存初始状态
        saveState(fabricCanvas);
      } catch (error) {
        console.error('加载图片失败:', error);
      }
    };

    loadImage();

    // 监听对象选择
    fabricCanvas.on('selection:created', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    // 监听对象修改
    fabricCanvas.on('object:modified', () => {
      saveState(fabricCanvas);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [image.preview]);

  // 保存状态到历史记录
  const saveState = useCallback((canvas: fabric.Canvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  }, [canvas, history, historyIndex]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  }, [canvas, history, historyIndex]);

  // 添加文字水印
  const addTextWatermark = useCallback(() => {
    if (!canvas) return;

    const text = new fabric.Text('水印文字', {
      left: 100,
      top: 100,
      fontSize: 48,
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 10,
        offsetX: 3,
        offsetY: 3,
      }),
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveState(canvas);
  }, [canvas, saveState]);

  // 添加图片水印
  const addImageWatermark = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && canvas) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imgUrl = event.target?.result as string;
          try {
            const img = await fabric.Image.fromURL(imgUrl);
            img.set({
              left: 50,
              top: 50,
              scaleX: 0.3,
              scaleY: 0.3,
              opacity: 0.8,
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveState(canvas);
          } catch (error) {
            console.error('加载水印图片失败:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [canvas, saveState]);

  // 删除选中对象
  const deleteActiveObject = useCallback(() => {
    if (!canvas || !activeObject) return;

    canvas.remove(activeObject);
    canvas.renderAll();
    saveState(canvas);
    setActiveObject(null);
  }, [canvas, activeObject, saveState]);

  // 更新文字内容
  const updateText = useCallback((newText: string) => {
    if (!canvas || !activeObject || activeObject.type !== 'text') return;

    (activeObject as fabric.Text).set('text', newText);
    canvas.renderAll();
  }, [canvas, activeObject]);

  // 更新文字颜色
  const updateColor = useCallback((color: string) => {
    if (!canvas || !activeObject) return;

    activeObject.set('fill', color);
    canvas.renderAll();
  }, [canvas, activeObject]);

  // 更新透明度
  const updateOpacity = useCallback((opacity: number) => {
    if (!canvas || !activeObject) return;

    activeObject.set('opacity', opacity / 100);
    canvas.renderAll();
  }, [canvas, activeObject]);

  // 更新大小
  const updateScale = useCallback((scale: number) => {
    if (!canvas || !activeObject) return;

    const newScale = scale / 100;
    activeObject.set({
      scaleX: newScale,
      scaleY: newScale,
    });
    canvas.renderAll();
  }, [canvas, activeObject]);

  // 导出图片
  const exportImage = useCallback(() => {
    if (!canvas) return;

    // 取消选择以避免导出时显示选择框
    canvas.discardActiveObject();
    canvas.renderAll();

    // 导出为 PNG
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    if (onSave) {
      onSave(dataUrl);
    }

    // 下载图片
    const link = document.createElement('a');
    link.download = `watermarked-${image.name}`;
    link.href = dataUrl;
    link.click();
  }, [canvas, image.name, onSave]);

  // 保存水印模板
  const saveTemplate = useCallback(() => {
    if (!canvas) return;

    // 取消选择
    canvas.discardActiveObject();
    canvas.renderAll();

    // 获取Canvas JSON（包含所有水印对象）
    const canvasJSON = JSON.stringify(canvas.toJSON());

    // 生成缩略图
    const thumbnail = canvas.toDataURL({
      format: 'png',
      quality: 0.5,
      multiplier: 0.3, // 缩小到30%作为缩略图
    });

    // 创建模板
    const template: WatermarkTemplate = {
      id: `template-${Date.now()}`,
      name: `水印模板 ${new Date().toLocaleString()}`,
      canvasJSON,
      thumbnail,
      createdAt: new Date(),
    };

    // 保存到状态
    addWatermarkTemplate(template);

    // 提示用户
    alert('水印模板已保存！现在可以在模板库中查看和使用了。');
  }, [canvas, addWatermarkTemplate]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas 区域 */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">编辑画布</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="撤销"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="重做"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <canvas ref={canvasRef} />
          </div>

          {/* 工具栏 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={addTextWatermark}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Type className="w-4 h-4" />
              添加文字
            </button>
            <button
              onClick={addImageWatermark}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              <ImageIcon className="w-4 h-4" />
              添加图片
            </button>
            {activeObject && (
              <button
                onClick={deleteActiveObject}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            )}
            <div className="flex-1"></div>
            <button
              onClick={saveTemplate}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition font-medium"
              title="保存为模板，可批量应用到其他图片"
            >
              <Save className="w-4 h-4" />
              保存模板
            </button>
            <button
              onClick={exportImage}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
              <Download className="w-4 h-4" />
              导出图片
            </button>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="lg:w-80">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-24">
          <h3 className="font-semibold text-gray-900 mb-4">属性面板</h3>

          {!activeObject ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">选择一个水印对象</p>
              <p className="text-xs mt-1">以编辑其属性</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 文字内容编辑 */}
              {activeObject.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文字内容
                  </label>
                  <input
                    type="text"
                    value={(activeObject as fabric.Text).text || ''}
                    onChange={(e) => updateText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* 颜色选择 */}
              {activeObject.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    颜色
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={activeObject.fill as string || '#ffffff'}
                      onChange={(e) => updateColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={activeObject.fill as string || '#ffffff'}
                      onChange={(e) => updateColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {/* 透明度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  透明度: {Math.round((activeObject.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(activeObject.opacity || 1) * 100}
                  onChange={(e) => updateOpacity(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 大小 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  大小: {Math.round((activeObject.scaleX || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={(activeObject.scaleX || 1) * 100}
                  onChange={(e) => updateScale(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 对象信息 */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">类型:</span>{' '}
                  {activeObject.type === 'text' ? '文字' : '图片'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">位置:</span>{' '}
                  X: {Math.round(activeObject.left || 0)}, Y: {Math.round(activeObject.top || 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h4 className="text-sm font-medium text-blue-900 mb-2">快捷键</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 拖拽移动水印</li>
            <li>• 拖拽边角调整大小</li>
            <li>• Delete 删除选中</li>
            <li>• Ctrl+Z 撤销</li>
            <li>• Ctrl+Y 重做</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
