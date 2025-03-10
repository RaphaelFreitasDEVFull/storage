'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { ptBR } from '@clerk/localizations'
import { Header } from './_components/Header'
import { Toaster } from 'sonner'

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
)

const inter = Inter({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className}  antialiased`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          localization={ptBR}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Header />
            {children}
            <Toaster />
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </body>
    </html>
  )
}
