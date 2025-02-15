import { ReactNode } from 'react'

import { Wrapper } from './Layout.styled'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return <Wrapper>{children}</Wrapper>
}
