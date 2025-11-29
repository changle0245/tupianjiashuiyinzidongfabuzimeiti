export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                水
              </div>
              <h1 className="text-xl font-bold text-gray-900">图片水印发布工具</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">功能</a>
              <a href="#platforms" className="text-gray-600 hover:text-blue-600 transition">支持平台</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">定价</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            🚀 MVP开发中
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            一站式图片水印
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              多平台发布工具
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            批量添加水印、AI智能生成标题描述、自动发布到7大主流平台
            <br />
            让内容创作更高效，发布管理更简单
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5">
              开始使用（开发中）
            </button>
            <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition">
              查看演示
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">核心功能</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-3">智能水印编辑</h4>
            <ul className="text-gray-600 space-y-2">
              <li>✓ 文字/图片水印</li>
              <li>✓ 自由拖拽定位</li>
              <li>✓ 调整大小透明度</li>
              <li>✓ 批量应用</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-3">AI智能助手</h4>
            <ul className="text-gray-600 space-y-2">
              <li>✓ AI生成标题</li>
              <li>✓ AI生成描述</li>
              <li>✓ 图片质量增强</li>
              <li>✓ 模糊变高清</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-3">定时自动发布</h4>
            <ul className="text-gray-600 space-y-2">
              <li>✓ 多平台同步发布</li>
              <li>✓ 定时发布设置</li>
              <li>✓ 发布队列管理</li>
              <li>✓ 状态实时监控</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">支持平台</h3>
          <p className="text-gray-600 text-center mb-12">一次上传，多平台同步发布</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 max-w-6xl mx-auto">
            {[
              { name: '微信视频号', color: 'bg-green-500' },
              { name: 'YouTube', color: 'bg-red-500' },
              { name: 'Facebook', color: 'bg-blue-600' },
              { name: 'Instagram', color: 'bg-pink-500' },
              { name: 'TikTok', color: 'bg-black' },
              { name: 'X (Twitter)', color: 'bg-gray-900' },
              { name: '小红书', color: 'bg-red-600' },
            ].map((platform) => (
              <div key={platform.name} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                <div className={`w-12 h-12 ${platform.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm`}>
                  {platform.name.slice(0, 1)}
                </div>
                <p className="text-sm font-medium text-gray-700">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">技术栈</h3>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-lg">前端技术</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 15 + React 18</li>
                <li>• TypeScript（类型安全）</li>
                <li>• Tailwind CSS（快速开发）</li>
                <li>• Fabric.js（Canvas编辑）</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">后端服务</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js API Routes</li>
                <li>• Sharp（图片处理）</li>
                <li>• OpenAI GPT-4（AI）</li>
                <li>• Real-ESRGAN（图片增强）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">定价计划</h3>
          <p className="text-gray-600 text-center mb-12">MVP阶段免费使用，商业化后订阅付费</p>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: '免费版', price: '$0', posts: '10次/月', features: ['基础水印', '手动发布', '2个平台'] },
              { name: '基础版', price: '$9.99', posts: '100次/月', features: ['高级水印', 'AI标题', '5个平台'], recommended: false },
              { name: '专业版', price: '$29.99', posts: '500次/月', features: ['所有功能', 'AI增强', '7个平台'], recommended: true },
              { name: '企业版', price: '$99.99', posts: '无限', features: ['所有功能', '优先支持', 'API接入'] },
            ].map((plan) => (
              <div key={plan.name} className={`bg-white rounded-xl p-6 ${plan.recommended ? 'ring-2 ring-blue-600 shadow-lg' : 'shadow-sm'} relative`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    推荐
                  </div>
                )}
                <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                <div className="text-3xl font-bold mb-1">{plan.price}</div>
                <div className="text-gray-500 text-sm mb-4">{plan.posts}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-gray-600 text-sm">✓ {feature}</li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg font-semibold transition ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  {plan.price === '$0' ? '免费开始' : '选择计划'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">准备好提升内容发布效率了吗？</h3>
          <p className="text-xl text-gray-600 mb-8">
            立即开始使用，让AI帮你管理多平台内容发布
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-lg font-semibold hover:shadow-xl transition transform hover:-translate-y-1">
            立即开始（即将上线）
          </button>
          <p className="text-sm text-gray-500 mt-4">
            🚀 预计MVP版本：2025年2月上线
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">产品</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600">功能特性</a></li>
                <li><a href="#" className="hover:text-blue-600">定价</a></li>
                <li><a href="#" className="hover:text-blue-600">更新日志</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">支持</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600">帮助中心</a></li>
                <li><a href="#" className="hover:text-blue-600">API文档</a></li>
                <li><a href="#" className="hover:text-blue-600">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">公司</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600">关于我们</a></li>
                <li><a href="#" className="hover:text-blue-600">博客</a></li>
                <li><a href="#" className="hover:text-blue-600">招聘</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">法律</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600">隐私政策</a></li>
                <li><a href="#" className="hover:text-blue-600">服务条款</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookie政策</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 图片水印发布工具. All rights reserved.</p>
            <p className="mt-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
