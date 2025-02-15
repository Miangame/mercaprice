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
      borderGray: string
      borderLightGray: string
      backgroundGray: string
    }
    transition: {
      standard: (firstProperty: string, ...restProperties: string[]) => string
    }
  }
}
