import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "영동곧감-주문 사이트",
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
      </head>
      <body
        className="antialiased font-sans"
      >
        {children}
      </body>
    </html>
  );
}
