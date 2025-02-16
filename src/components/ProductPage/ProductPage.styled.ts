import styled from 'styled-components'

import { media } from '@/theme/media'

export const StyledImage = styled.img`
  width: 100%;
  max-width: ${({ theme }) => theme.size.units(40)};
  border-radius: ${({ theme }) => theme.size.units(0.5)};
`

export const FakeImage = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.size.units(40)};
  height: ${({ theme }) => theme.size.units(40)};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.size.units(0.5)};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.size.units(3)};
  margin: ${({ theme }) => theme.size.units(2)} 0;
`

export const PricesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export const Price = styled.p`
  font-size: ${({ theme }) => theme.size.units(5)};
  margin: 0;
  font-weight: bold;

  & > span {
    font-size: ${({ theme }) => theme.size.units(2)};
    font-weight: normal;
  }
`

export const SecondPrice = styled.p`
  font-size: ${({ theme }) => theme.size.units(3)};
  margin: 0;
  font-weight: bold;

  & > span {
    font-size: ${({ theme }) => theme.size.units(2)};
    font-weight: normal;
  }
`

export const PricesHistoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.units(4)};
`

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.size.units(2)};

  ${PricesHistoryWrapper} {
    margin-top: ${({ theme }) => theme.size.units(4)};
  }

  ${media.greaterThan('md')`
    width: 80%;
  `}

  ${media.greaterThan('lg')`
    width: 60%;
  `}
`
