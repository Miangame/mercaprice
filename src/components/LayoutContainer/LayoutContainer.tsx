import { ReactNode } from 'react'

import { Wrapper } from './LayoutContainer.styled'

interface LayoutContainerProps {
  children: ReactNode
}

export const LayoutContainer = ({ children }: LayoutContainerProps) => {
  return <Wrapper>{children}</Wrapper>
}
