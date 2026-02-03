import { CiSearch } from 'react-icons/ci'
import styled, { DefaultTheme } from 'styled-components'
import { motion } from 'framer-motion'

import { media } from '@/theme/media'

export const Wrapper = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme: { size } }) => size.units(2)};
  padding: ${({ theme: { size } }) => size.units(3)};

  /* Glassmorphism */
  background: ${({ theme }) => theme.colors.glass.background};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border-bottom: 1px solid ${({ theme }) => theme.colors.glass.border};
  box-shadow: ${({ theme }) => theme.colors.glass.shadow};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${media.greaterThan('md')`
    padding: ${({ theme: { size } }: { theme: DefaultTheme }) => `
      ${size.units(3)} ${size.units(4)}
    `};
  `}

  ${media.greaterThan('lg')`
    justify-content: flex-start;
    gap: ${({ theme: { size } }: { theme: DefaultTheme }) => size.units(4)};
  `}
`

export const StyledImg = styled.img<{ $isHide: boolean }>`
  width: ${({ theme: { size } }) => size.units(6)};
  opacity: ${({ $isHide }) => ($isHide ? 0 : 1)};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05) rotate(-2deg);
  }

  ${media.greaterThan('md')`
    width: ${({ theme: { size } }: { theme: DefaultTheme }) => size.units(30)};
  `}
`

export const InputWrapper = styled(motion.div)`
  position: relative;
  flex: 1;
  max-width: 600px;
`

export const StyledInput = styled.input`
  width: 100%;
  border-radius: ${({ theme: { size } }) => size.units(3)};
  border: 2px solid ${({ theme }) => theme.colors.borderGray};
  background-color: ${({ theme }) => theme.colors.backgroundGray};
  padding: ${({ theme: { size } }) => `${size.units(1.5)} ${size.units(6)}`};
  font-size: ${({ theme: { size } }) => size.units(2)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 4px rgba(34, 158, 107, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`

export const StyledSearchIcon = styled(CiSearch)`
  width: ${({ theme: { size } }) => size.units(3)};
  height: ${({ theme: { size } }) => size.units(3)};
  position: absolute;
  top: 50%;
  left: ${({ theme: { size } }) => size.units(2)};
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
  transition: color 0.2s;
  pointer-events: none;

  ${StyledInput}:focus ~ & {
    color: ${({ theme }) => theme.colors.primary};
  }
`
