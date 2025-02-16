import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'

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

  const [searchText, setSearchText] = useState('')

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

  return (
    <Wrapper>
      <StyledImg
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
      <InputWrapper>
        <StyledSearchIcon />
        <StyledInput
          type="text"
          value={searchText}
          placeholder="Buscar productos"
          onChange={handleChange}
        />
      </InputWrapper>
    </Wrapper>
  )
}
