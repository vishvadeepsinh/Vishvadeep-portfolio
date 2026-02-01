import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vishvadeepsinh Chudasama - Portfolio",
  description: "Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://drqedqzxdzdaoruyvwpb.supabase.co" />
        {/* Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://drqedqzxdzdaoruyvwpb.supabase.co" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
