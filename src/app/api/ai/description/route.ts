import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageDescription, platform, keywords, tone } = await request.json();

    if (!imageDescription) {
      return NextResponse.json(
        { error: '请提供图片描述' },
        { status: 400 }
      );
    }

    // 根据平台定制提示词
    const platformGuidelines: Record<string, string> = {
      'youtube': '适合YouTube的详细描述，包含关键词和标签，300-500字',
      'wechat': '适合微信视频号的描述，简洁明了，100-200字',
      'tiktok': '适合TikTok的简短描述，使用话题标签，100-150字',
      'instagram': '适合Instagram的描述，可以使用emoji和标签，150-300字',
      'facebook': '适合Facebook的描述，鼓励互动，200-300字',
      'xiaohongshu': '适合小红书的种草风格描述，使用emoji和话题标签，200-400字',
      'twitter': '适合Twitter/X的简短描述，控制在280字符以内',
      'default': '创建一个详细的描述，200-300字',
    };

    const guideline = platformGuidelines[platform || 'default'] || platformGuidelines.default;

    // 语气风格
    const toneMap: Record<string, string> = {
      'professional': '专业、正式',
      'casual': '轻松、随意',
      'enthusiastic': '热情、活力',
      'informative': '信息丰富、教育性',
      'humorous': '幽默、有趣',
    };

    const toneDescription = tone ? toneMap[tone] || '自然友好' : '自然友好';

    const prompt = `
你是一位专业的社交媒体内容创作者。请根据以下信息生成一个吸引人的内容描述：

图片内容描述: ${imageDescription}
${keywords ? `关键词: ${keywords}` : ''}
目标平台: ${platform || '通用'}
语气风格: ${toneDescription}
要求: ${guideline}

请直接返回描述内容，不要额外的说明或标题。
描述要能吸引用户阅读，并鼓励互动（点赞、评论、分享）。
如果适合该平台，可以适当添加emoji和话题标签。
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的社交媒体内容创作专家，擅长创作吸引人的内容描述。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const description = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({
      description,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('生成描述失败:', error);

    // 处理 OpenAI API 错误
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API 密钥无效' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.message || '生成描述失败' },
      { status: 500 }
    );
  }
}
