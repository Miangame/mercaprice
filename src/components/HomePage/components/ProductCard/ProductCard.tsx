import { ProductWithPrice } from '@/types/ProductWithPrice'
import { FakeImg, Name, Price, StyledImg, Wrapper } from './ProductCard.styled'

interface ProductCardProps {
  item: ProductWithPrice
}

export const ProductCard = ({ item }: ProductCardProps) => {
  return (
    <Wrapper>
      {item.image ? (
        <StyledImg src={item.image} alt={item.displayName} />
      ) : (
        <FakeImg />
      )}
      <Name>{item.displayName}</Name>
      <Price>
        {item.unitPrice.toFixed(2)}€<span>/ud</span>
      </Price>
    </Wrapper>
  )
}
