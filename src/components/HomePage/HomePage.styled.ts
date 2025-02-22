import styled from 'styled-components'
import { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.size.units(2)};

  ${media.greaterThan('lg')`
    padding: ${({ theme }: DefaultTheme) => `0 ${theme.size.units(8)}`};
    padding-top: ${({ theme }: DefaultTheme) => theme.size.units(4)};
  `}
`

export const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;

  ${media.greaterThan('md')`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.greaterThan('lg')`
    grid-template-columns: repeat(5, 1fr);
  `}
`

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.units(3)};
  margin: 0 0 1rem;
  text-align: center;

  ${media.greaterThan('md')`
    font-size: ${({ theme }: DefaultTheme) => theme.size.units(4)};
  `}
`

export const LoadMoreButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.size.units(2)};
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`
