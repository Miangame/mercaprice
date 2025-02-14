import { createGlobalStyle } from 'styled-components'

export const ResetCSS = createGlobalStyle`
  * {
    min-width: 0;
    font: inherit;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  img, video, svg {
    display: block;
    height: auto;
    max-width: 100%;
  }

  body {
    margin: 0;
    min-height: 100dvh;
  }

  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
    margin: 0; // Mine
  }

  p {
    text-wrap: pretty;
  }
`
