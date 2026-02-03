import styled from 'styled-components'
import { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.size.units(2)};

  ${media.greaterThan('lg')`
    padding: ${({ theme }: { theme: DefaultTheme }) => `0 ${theme.size.units(8)}`};
    padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.size.units(4)};
  `}
`

export const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1rem;
  transition: grid-template-columns 0.3s ease;

  ${media.greaterThan('md')`
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  `}

  ${media.greaterThan('lg')`
    grid-template-columns: repeat(5, 1fr);
    gap: 2.5rem;
  `}
`

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.units(3)};
  margin: 0 0 1rem;
  text-align: center;

  ${media.greaterThan('md')`
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.size.units(4)};
  `}
`

export const LoadMoreButton = styled.button`
  background: ${({ theme }) => theme.colors.primaryGradient};
  border: none;
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.size.units(2)};
  font-weight: 600;
  margin-top: 2rem;
  padding: ${({ theme }) => `${theme.size.units(2)} ${theme.size.units(6)}`};
  box-shadow: ${({ theme }) => theme.colors.shadow.colored};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(34, 158, 107, 0.4);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
