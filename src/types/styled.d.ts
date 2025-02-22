// import original module declaration
import 'styled-components'

// and extend it
declare module 'styled-components' {
  export interface DefaultTheme {
    size: {
      units: (value: number) => string
    }
    colors: {
      primary: string
      primaryDark: string
      borderGray: string
      borderLightGray: string
      backgroundGray: string
      textLight: string
      white: string
    }
    transition: {
      standard: (firstProperty?: string, ...restProperties: string[]) => string
    }
  }
}
