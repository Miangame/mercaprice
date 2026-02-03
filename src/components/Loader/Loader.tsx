import { LoaderContainer, LoaderDot } from './Loader.styled'

export const Loader = () => {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15
      }
    },
    end: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const dotVariants = {
    start: { y: 0 },
    end: { y: -20 }
  }

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut'
  }

  return (
    <LoaderContainer variants={containerVariants} initial="start" animate="end">
      <LoaderDot variants={dotVariants} transition={dotTransition} />
      <LoaderDot variants={dotVariants} transition={dotTransition} />
      <LoaderDot variants={dotVariants} transition={dotTransition} />
    </LoaderContainer>
  )
}
