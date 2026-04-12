import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2026 日本名古屋之旅 🇯🇵',
  description: '2026年4月16日至21日 名古屋・飛驒高山・上高地・白川鄉・吉卜力公園',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#F8F5F0]">
        {children}
      </body>
    </html>
  )
}
