import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Subtitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.size.units(1.5)};
  font-weight: 400;

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`

export const Wrapper = styled(motion.footer)`
  position: relative;
  padding: ${({ theme }) => `${theme.size.units(5)} 0`};
  text-align: center;
  background: ${({ theme }) => theme.colors.primaryGradient};
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  /* Wave separator */
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: 0;
    width: 100%;
    height: 50px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E")
      no-repeat;
    background-size: cover;
  }

  ${Subtitle} {
    margin-top: ${({ theme }) => theme.size.units(2)};
  }
`

export const IconsWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.size.units(3)};
`

export const StyledIcon = styled(motion.i)`
  color: ${({ theme }) => theme.colors.white};
  width: ${({ theme }) => theme.size.units(4)};
  height: ${({ theme }) => theme.size.units(4)};
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

  &:hover {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
`
