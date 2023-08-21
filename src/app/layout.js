import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kamino One — human-friendly analytics for Kamino Finance',
  description: 'Kamino One is a human-friendly analytics dashboard for Kamino Finance.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
