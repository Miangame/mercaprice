import styled, { DefaultTheme } from 'styled-components'
import { motion } from 'framer-motion'

import { media } from '@/theme/media'

export const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.colors.shadow.sm};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;

  /* Efecto de brillo */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
    z-index: 1;
  }

  &:hover::before {
    left: 100%;
  }
`

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.backgroundGray};
  margin-bottom: 0.75rem;
`

export const StyledImg = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`

export const FakeImg = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
`

export const Name = styled.p`
  font-size: ${({ theme }) => theme.size.units(1.75)};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 2;

  ${media.greaterThan('md')`
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.size.units(2.5)};
  `}
`

export const Price = styled(motion.h4)`
  margin: 0;
  font-size: ${({ theme }) => theme.size.units(2.5)};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  position: relative;
  z-index: 2;

  & > span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: ${({ theme }) => theme.size.units(2)};
  }
`
