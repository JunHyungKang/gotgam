import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "충북 영동 물한리 곶감 - 온라인 주문하기",
  description: "물한계곡 청정 자연이 빚어낸 영동 곶감 주문 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased font-sans"
      >
        {children}
      </body>
    </html>
  );
}
