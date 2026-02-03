import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { motion } from 'framer-motion'

import { IconsWrapper, StyledIcon, Subtitle, Wrapper } from './Footer.styled'

export const Footer = () => {
  const year = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }

  return (
    <Wrapper
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <IconsWrapper
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.a
          href="https://github.com/Miangame/mercaprice"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariants}
        >
          <StyledIcon
            as={FaGithub}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.9 }}
          />
        </motion.a>
        <motion.a
          href="https://x.com/miguel5gavilan"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariants}
        >
          <StyledIcon
            as={FaXTwitter}
            whileHover={{
              scale: 1.2,
              rotate: -360,
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.9 }}
          />
        </motion.a>
      </IconsWrapper>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Subtitle>
          © {year} Mercaprice | Made by{' '}
          <a
            href="https://x.com/miguel5gavilan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Miangame
          </a>
        </Subtitle>
      </motion.div>
    </Wrapper>
  )
}
