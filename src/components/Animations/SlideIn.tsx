import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

type Direction = 'left' | 'right' | 'up' | 'down'

interface SlideInProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  threshold?: number
  distance?: number
}

const getInitialPosition = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 }
    case 'right':
      return { x: distance, y: 0 }
    case 'up':
      return { x: 0, y: -distance }
    case 'down':
      return { x: 0, y: distance }
  }
}

export const SlideIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  distance = 30
}: SlideInProps) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true
  })

  const initialPosition = getInitialPosition(direction, distance)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initialPosition }}
      animate={
        inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialPosition }
      }
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
