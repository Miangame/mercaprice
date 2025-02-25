import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { Carousel } from 'react-responsive-carousel'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { NextButton, PrevButton } from './ProductImagesCarousel.styled'

interface ProductImagesCarouselProps {
  images: string[]
}

export const ProductImagesCarousel = ({
  images
}: ProductImagesCarouselProps) => {
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
    <Carousel
      showArrows
      showThumbs={false}
      showIndicators={false}
      renderArrowNext={getArrowNext}
      renderArrowPrev={getArrowPrev}
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Product image ${index + 1}`} />
        </div>
      ))}
    </Carousel>
  )
}
