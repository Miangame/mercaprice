import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { Carousel } from 'react-responsive-carousel'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { NextButton, PrevButton } from './ProductImagesCarousel.styled'

interface ProductImagesCarouselProps {
  images: string[]
}

export const ProductImagesCarousel = ({
  images
}: ProductImagesCarouselProps) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const getArrowNext = (
    clickHandler: () => void,
    hasPrev: boolean,
    label: string
  ) => {
    if (!hasPrev) {
      return undefined
    }

    return (
      <NextButton
        type="button"
        onClick={clickHandler}
        title={label}
        disabled={!hasPrev}
      >
        <FaArrowAltCircleRight size={30} color="black" />
      </NextButton>
    )
  }

  const getArrowPrev = (
    clickHandler: () => void,
    hasNext: boolean,
    label: string
  ) => {
    if (!hasNext) {
      return undefined
    }

    return (
      <PrevButton
        type="button"
        onClick={clickHandler}
        title={label}
        disabled={!hasNext}
      >
        <FaArrowAltCircleLeft size={30} color="black" />
      </PrevButton>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Carousel
        showArrows
        showThumbs={false}
        showIndicators={false}
        renderArrowNext={getArrowNext}
        renderArrowPrev={getArrowPrev}
        animationHandler="fade"
        swipeable
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: isZoomed ? 1 : 1.05 }}
            onClick={() => setIsZoomed(!isZoomed)}
            style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            {...({} as any)}
          >
            <motion.img
              src={image}
              alt={`Product image ${index + 1}`}
              animate={{ scale: isZoomed ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
              {...({} as any)}
            />
          </motion.div>
        ))}
      </Carousel>
    </motion.div>
  )
}
