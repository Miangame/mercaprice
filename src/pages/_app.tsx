import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { Analytics } from '@vercel/analytics/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { Head } from '../components/Head/Head'
import { ResetCSS } from '../components/ResetCSS/ResetCSS.styles'
import { GlobalStyles } from '../components/GlobalStyles/GlobalStyles.styled'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

import { ScrollProgress } from '@/components/ScrollProgress/ScrollProgress'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { theme } from '@/theme/theme'
import { Layout } from '@/components/Layout/Layout'
import { LayoutContainer } from '@/components/LayoutContainer/LayoutContainer'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ThemeProvider theme={theme}>
        <Head />
        <ResetCSS />
        <GlobalStyles />

        <ScrollProgress />
        <ThemeToggle />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(34, 158, 107, 0.16)',
              border: '1px solid rgba(34, 158, 107, 0.1)'
            },
            success: { iconTheme: { primary: '#229e6b', secondary: '#fff' } }
          }}
        />

        <LayoutContainer>
          <Header />
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={router.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
          <Footer />
        </LayoutContainer>

        <Analytics />
      </ThemeProvider>
    </NextThemesProvider>
  )
}
