import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { useDebounce } from '@/hooks/useDebounce'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  InputWrapper,
  StyledImg,
  StyledInput,
  StyledSearchIcon,
  Wrapper
} from './Header.styled'

export const Header = () => {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [searchText, setSearchText] = useState<string>('')

  const { scrollY } = useScroll()

  // Reducir padding en scroll
  const headerPadding = useTransform(scrollY, [0, 100], ['1.5rem', '1rem'])

  const commitChanges = (value: string) => {
    router.push(
      {
        pathname: '/',
        query: value ? { search: value } : undefined
      },
      undefined,
      { shallow: true }
    )
  }

  const debounceCommitChanges = useDebounce(commitChanges)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value

    setSearchText(text)
    debounceCommitChanges(text)
  }

  const handleImageClick = () => {
    router.push('/')

    setSearchText('')
  }

  return (
    <Wrapper
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        paddingTop: headerPadding,
        paddingBottom: headerPadding
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
      >
        <StyledImg
          onClick={handleImageClick}
          src={
            isMobile === undefined
              ? undefined
              : isMobile
                ? '/img/singleLogo.webp'
                : '/img/logo.webp'
          }
          $isHide={isMobile === undefined}
          alt="Logo"
        />
      </motion.div>
      <InputWrapper
        initial={{ width: '60%', opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <StyledInput
          type="text"
          value={searchText}
          placeholder="Buscar productos"
          onChange={handleChange}
        />
        <StyledSearchIcon />
      </InputWrapper>
    </Wrapper>
  )
}
