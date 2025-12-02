import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 延迟初始化 OpenAI 客户端
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { imageDescription, platform, keywords } = await request.json();

    if (!imageDescription) {
      return NextResponse.json(
        { error: '请提供图片描述' },
        { status: 400 }
      );
    }

    // 根据平台定制提示词
    const platformGuidelines: Record<string, string> = {
      'youtube': '适合YouTube的吸引人标题，控制在60字符以内',
      'wechat': '适合微信视频号的标题，简洁有力，控制在30字以内',
      'tiktok': '适合TikTok的热门标题，使用流行话题标签',
      'instagram': '适合Instagram的标题，可以包含emoji',
      'facebook': '适合Facebook的标题，引发互动',
      'xiaohongshu': '适合小红书的标题，加入相关话题标签',
      'twitter': '适合Twitter/X的标题，控制在280字符以内',
      'default': '创建一个吸引人的标题',
    };

    const guideline = platformGuidelines[platform || 'default'] || platformGuidelines.default;

    const prompt = `
你是一位专业的社交媒体内容创作者。请根据以下信息生成3个吸引人的标题：

图片内容描述: ${imageDescription}
${keywords ? `关键词: ${keywords}` : ''}
目标平台: ${platform || '通用'}
要求: ${guideline}

请直接返回3个标题，每行一个，不要编号，不要额外说明。
标题要有创意、吸引眼球，并能激发用户的兴趣。
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的社交媒体内容创作专家，擅长创作吸引人的标题。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const titles = completion.choices[0]?.message?.content
      ?.trim()
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim()) || [];

    return NextResponse.json({
      titles,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('生成标题失败:', error);

    // 处理 OpenAI API 错误
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API 密钥无效' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.message || '生成标题失败' },
      { status: 500 }
    );
  }
}
