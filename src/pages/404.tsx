import Link from 'next/link'

import {
  Wrapper,
  Title,
  Description
} from '@/components/NotFoundPage/NotFoundPage.styled'

const NotFoundPage = () => (
  <Wrapper>
    <Title>🚫 Producto no encontrado</Title>
    <Description>
      El producto que estás intentando buscar no existe o ha sido eliminado.
    </Description>
    <Link href="/">Ir a la página principal</Link>
  </Wrapper>
)

export default NotFoundPage
