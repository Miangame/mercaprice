import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { ProductWithPrice } from '@/types/ProductWithPrice'
import {
  FakeImg,
  ImageWrapper,
  Name,
  Price,
  StyledImg,
  Wrapper
} from './ProductCard.styled'

interface ProductCardProps {
  item: ProductWithPrice
  onClick: () => void
  index?: number
}

export const ProductCard = ({ item, onClick, index = 0 }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Variants para la animación de entrada
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: Math.min(index * 0.05, 1), // Limitar delay máximo a 1s
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  // Variants para la imagen
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <Wrapper
      ref={ref}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{
        y: -8,
        boxShadow: '0 16px 48px rgba(34, 158, 107, 0.24)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <ImageWrapper>
        {item.image ? (
          <StyledImg
            src={item.image}
            alt={item.displayName}
            variants={imageVariants}
            initial="hidden"
            animate={imageLoaded ? 'visible' : 'hidden'}
            onLoad={() => setImageLoaded(true)}
            whileHover={{
              scale: 1.05,
              rotate: [0, -1, 1, 0],
              transition: { duration: 0.3 }
            }}
          />
        ) : (
          <FakeImg />
        )}
      </ImageWrapper>

      <Name>{item.displayName}</Name>

      <Price
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {item.unitPrice.toFixed(2)}€<span>/ud</span>
      </Price>
    </Wrapper>
  )
}
