import styled, { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.size.units(20)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(2)};

  ${media.greaterThan('md')`
    height: ${({ theme }: { theme: DefaultTheme }) => theme.size.units(25)};
  `}
`

export const Title = styled.h2``
