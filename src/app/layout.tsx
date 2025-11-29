import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "图片加水印自动发布 - 多平台社交媒体管理工具",
  description: "批量为图片添加水印，AI生成标题描述，自动发布到YouTube、微信、小红书等多个平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
