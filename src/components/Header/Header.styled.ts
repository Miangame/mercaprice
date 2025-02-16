import { CiSearch } from 'react-icons/ci'
import styled, { DefaultTheme } from 'styled-components'

import { media } from '@/theme/media'

export const Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme: { size } }) => size.units(2)};
  padding: ${({ theme: { size } }) => size.units(3)};
  border-bottom: ${({ theme: { colors } }) =>
    `1px solid ${colors.borderLightGray}`};

  ${media.greaterThan('md')`
    padding: ${({ theme: { size } }: DefaultTheme) => `
      ${size.units(3)} ${size.units(4)}
    `};
  `}

  ${media.greaterThan('lg')`
    justify-content: flex-start;
    gap: ${({ theme: { size } }: DefaultTheme) => size.units(4)};
  `}
`

export const StyledImg = styled.img<{ $isHide: boolean }>`
  width: ${({ theme: { size } }) => size.units(6)};
  opacity: ${({ $isHide }) => ($isHide ? 0 : 1)};
  cursor: pointer;

  ${media.greaterThan('md')`
    width: ${({ theme: { size } }: DefaultTheme) => size.units(30)};
  `}
`

export const StyledInput = styled.input(({ theme: { size, colors } }) => ({
  borderRadius: size.units(2.5),
  border: `1px solid ${colors.borderGray}`,
  backgroundColor: colors.backgroundGray,
  padding: size.units(1),
  paddingLeft: size.units(6),

  '&:focus': {
    outline: `1px solid ${colors.primary}`
  }
}))

export const StyledSearchIcon = styled(CiSearch)(({ theme: { size } }) => ({
  width: size.units(3),
  height: size.units(3)
}))

export const InputWrapper = styled.div(({ theme: { size } }) => ({
  position: 'relative',

  [StyledSearchIcon]: {
    position: 'absolute',
    top: '50%',
    left: size.units(2),
    transform: 'translateY(-50%)'
  }
}))
