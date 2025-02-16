import styled, { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.standard()};

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }
`

export const StyledImg = styled.img`
  width: 100%;
  border-radius: 8px;
`

export const FakeImg = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 8px;
`

export const Name = styled.p`
  font-size: ${({ theme }) => theme.size.units(1.75)};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${media.greaterThan('md')`
    font-size: ${({ theme }: DefaultTheme) => theme.size.units(2.5)};
  `}
`

export const Price = styled.h4`
  margin: 0;

  & > span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textLight};
  }
`
