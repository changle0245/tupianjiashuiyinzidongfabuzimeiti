import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// 延迟初始化 Replicate 客户端
function getReplicateClient() {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not configured');
  }
  return new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
}

export async function POST(request: NextRequest) {
  try {
    const replicate = getReplicateClient();
    const { imageUrl, scale = 2 } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: '请提供图片URL' },
        { status: 400 }
      );
    }

    // 使用 Real-ESRGAN 模型进行图片增强
    // 这个模型可以将低分辨率图片提升到高分辨率
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: scale, // 放大倍数: 2, 3, 或 4
          face_enhance: false, // 是否增强人脸
        }
      }
    );

    // output 是增强后的图片URL
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      enhancedImageUrl,
      originalUrl: imageUrl,
      scale,
    });
  } catch (error: any) {
    console.error('图片增强失败:', error);

    // 处理 Replicate API 错误
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Replicate API Token 无效' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.message || '图片增强失败' },
      { status: 500 }
    );
  }
}

// 获取增强任务状态（用于异步处理）
export async function GET(request: NextRequest) {
  try {
    const replicate = getReplicateClient();
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: '请提供预测ID' },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(predictionId);

    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (error: any) {
    console.error('获取任务状态失败:', error);

    return NextResponse.json(
      { error: error?.message || '获取任务状态失败' },
      { status: 500 }
    );
  }
}
