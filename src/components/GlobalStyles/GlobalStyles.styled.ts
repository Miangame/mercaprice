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

export const GlobalStyles = createGlobalStyle`
  html, body {
    font-family: ${poppins.style.fontFamily}, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overscroll-behavior: none;
  }

  /* Dark mode support */
  .dark {
    background-color: #0f1419;
    color: #e2e8f0;
  }

  .dark body {
    background-color: #0f1419;
    color: #e2e8f0;
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

  /* Smooth transitions for all theme changes */
  * {
    transition-property: background-color, border-color, color;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
  }
`
