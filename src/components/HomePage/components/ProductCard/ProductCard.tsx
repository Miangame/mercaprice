import { ProductWithPrice } from '@/types/ProductWithPrice'
import { FakeImg, Name, Price, StyledImg, Wrapper } from './ProductCard.styled'

interface ProductCardProps {
  item: ProductWithPrice
  onClick: () => void
}

export const ProductCard = ({ item, onClick }: ProductCardProps) => {
  return (
    <Wrapper onClick={onClick}>
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
