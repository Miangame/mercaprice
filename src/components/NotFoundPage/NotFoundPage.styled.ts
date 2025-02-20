import styled, { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.size.units(10)} 0`};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.size.units(3)};

  ${media.greaterThan('md')`
    font-size: ${({ theme }: DefaultTheme) => theme.size.units(5)};
  `}
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.size.units(2)};
  margin-bottom: ${({ theme }) => theme.size.units(3)};
`
