// import original module declaration
import 'styled-components'

// and extend it
declare module 'styled-components' {
  export interface DefaultTheme {
    size: {
      units: (value: number) => string
    }
    colors: {
      // Primary colors
      primary: string
      primaryDark: string
      primaryLight: string

      // Gradients
      primaryGradient: string
      accentGradient: string

      // Shadows system
      shadow: {
        sm: string
        md: string
        lg: string
        xl: string
        colored: string
        glow: string
      }

      // Backgrounds
      background: string
      backgroundGray: string
      backgroundDark: string

      // Glassmorphism
      glass: {
        background: string
        backgroundDark: string
        border: string
        borderDark: string
        shadow: string
      }

      // Status colors
      success: string
      warning: string
      error: string
      info: string

      // Dark mode colors
      dark: {
        background: string
        surface: string
        border: string
        text: string
        textLight: string
      }

      // Borders
      borderGray: string
      borderLightGray: string

      // Text
      textLight: string

      // Basic colors
      white: string
      black: string
    }
    transition: {
      standard: (firstProperty?: string, ...restProperties: string[]) => string
      easing: {
        easeInOut: string
        easeOut: string
        easeIn: string
        sharp: string
        spring: string
      }
      duration: {
        fastest: number
        fast: number
        normal: number
        slow: number
        slowest: number
      }
      spring: {
        smooth: { type: 'spring'; stiffness: number; damping: number }
        bouncy: { type: 'spring'; stiffness: number; damping: number }
        gentle: { type: 'spring'; stiffness: number; damping: number }
      }
    }
  }
}
