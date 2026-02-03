import styled from 'styled-components'

import { ProductCardSkeleton } from './ProductCardSkeleton'
import { media } from '@/theme/media'

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1rem;

  ${media.greaterThan('md')`
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  `}

  ${media.greaterThan('lg')`
    grid-template-columns: repeat(5, 1fr);
    gap: 2.5rem;
  `}
`

interface ProductGridSkeletonProps {
  count?: number
}

export const ProductGridSkeleton = ({
  count = 20
}: ProductGridSkeletonProps) => {
  return (
    <GridWrapper>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </GridWrapper>
  )
}
