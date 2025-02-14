import { Poppins, Roboto } from 'next/font/google'
import { createGlobalStyle } from 'styled-components'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600']
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700']
})

export const GlobalStyles = createGlobalStyle<{ $isDarkMode?: boolean }>`
  html, body {
    font-family: ${poppins.style.fontFamily}, sans-serif;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overscroll-behavior: none;
  }

  #__next {
    position: relative;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${poppins.style.fontFamily}, sans-serif;
    font-weight: 600;
  }

  padding, span, li {
    font-family: ${roboto.style.fontFamily}, sans-serif;
    font-weight: 400;
  }
`
