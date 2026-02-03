import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.colors.shadow.sm};
`

const ImageSkeleton = styled.div`
  margin-bottom: 1rem;
`

const TitleSkeleton = styled.div`
  margin-bottom: 0.5rem;
`

const PriceSkeleton = styled.div`
  margin-top: 0.5rem;
`

export const ProductCardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <ImageSkeleton>
        <Skeleton height={200} borderRadius={8} />
      </ImageSkeleton>
      <TitleSkeleton>
        <Skeleton height={20} />
      </TitleSkeleton>
      <PriceSkeleton>
        <Skeleton height={20} width="60%" />
      </PriceSkeleton>
    </SkeletonWrapper>
  )
}
