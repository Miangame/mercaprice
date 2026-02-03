import { motion } from 'framer-motion'
import styled from 'styled-components'

export const LoaderContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.size.units(1)};
  padding: ${({ theme }) => theme.size.units(10)} 0;
`

export const LoaderDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`
