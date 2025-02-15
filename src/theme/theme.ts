import { DefaultTheme } from 'styled-components'

import { colors } from './color'
import { getSizes } from './size'
import { transition } from './transition'

export const theme: DefaultTheme = {
  colors,
  size: getSizes(false),
  transition
}
