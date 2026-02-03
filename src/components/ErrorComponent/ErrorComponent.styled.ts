import styled, { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme }) => theme.size.units(10)};
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  font-size: ${({ theme }) => theme.size.units(3)};

  ${media.greaterThan('md')`
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.size.units(4)};
  `}
`
