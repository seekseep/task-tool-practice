import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP as Font } from 'next/font/google'
import '@aws-amplify/ui-react/styles.css';
import Providers from './component/Providers'
import ViewCaution from './component/ViewCaution';

const font = Font({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'タスク管理の練習',
  description: 'タスク管理の練習',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <ViewCaution />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
