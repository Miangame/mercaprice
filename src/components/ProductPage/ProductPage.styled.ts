import { ElementType } from 'react'
import styled, { css } from 'styled-components'

import { media } from '@/theme/media'

const withBox = (Component: ElementType) =>
  styled(Component)(
    () => css`
      border: 1px solid ${({ theme }) => theme.colors.borderGray};
      border-radius: ${({ theme }) => theme.size.units(1)};
      box-shadow: ${({ theme }) => theme.colors.borderLightGray} 0px 0px 5px;
      padding: ${({ theme }) => theme.size.units(2)};
    `
  )

export const StyledImage = withBox(styled.img`
  width: 100%;
`)

export const FakeImage = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.size.units(40)};
  height: ${({ theme }) => theme.size.units(40)};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.size.units(0.5)};
`

export const Title = styled.h1`
  width: 100%;
  font-size: ${({ theme }) => theme.size.units(3.75)};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const Subtitle = styled.h2`
  width: 100%;
  font-size: ${({ theme }) => theme.size.units(3)};
  padding: ${({ theme }) => `${theme.size.units(1)} 0`};
`

export const PricesWrapper = withBox(styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.size.units(2)};
`)

export const Price = styled.p`
  font-size: ${({ theme }) => theme.size.units(2.25)};
  margin: 0;

  & > span {
    font-size: ${({ theme }) => theme.size.units(2.5)};
    font-weight: bold;
  }
`

export const StyledButton = styled.a`
  width: fit-content;
  padding: ${({ theme }) => theme.size.units(1.5)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.size.units(1)};
  font-size: ${({ theme }) => theme.size.units(2)};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.standard()};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.size.units(1)};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`

export const PricesHistoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(4)};
`

export const Wrapper = styled.div`
  padding: ${({ theme }) => theme.size.units(2)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(4)};

  ${media.greaterThan('sm')`
    width: 65%;
  `}

  ${media.greaterThan('md')`
    width: 75%;
  `}

  ${media.greaterThan('lg')`
    width: 60%;
  `}
`

export const ColumnsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(4)};

  ${media.greaterThan('md')`
    flex-direction: row;
  `}
`

export const ChartWrapper = withBox(styled.div`
  width: 100%;
`)

export const NutritionalInfoWrapper = withBox(styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(1)};

  & > p {
    font-size: ${({ theme }) => theme.size.units(2)};
    margin: 0;

    & > span {
      font-weight: bold;
    }
  }
`)

export const LeftColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(4)};
`

export const CarouselWrapper = withBox(styled.div``)
