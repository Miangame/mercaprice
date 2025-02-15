import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { Analytics } from '@vercel/analytics/react'

import { Head } from '../components/Head/Head'
import { ResetCSS } from '../components/ResetCSS/ResetCSS.styles'
import { GlobalStyles } from '../components/GlobalStyles/GlobalStyles.styled'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

import { theme } from '@/theme/theme'
import { Layout } from '@/components/Layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head />
      <ResetCSS />
      <GlobalStyles />

      <Header />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />

      <Analytics />
    </ThemeProvider>
  )
}
