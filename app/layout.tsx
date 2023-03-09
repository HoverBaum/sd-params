import GlobalProviders from './GlobalProviders'
import './globals.css'

export const metadata = {
  title: 'Param Explorer',
  description: 'Explore Stable Diffusion Parameters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  )
}
