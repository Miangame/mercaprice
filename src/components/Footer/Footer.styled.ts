import styled from 'styled-components'

export const Subtitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.size.units(1.5)};
  font-weight: 400;

  a {
    color: ${({ theme }) => theme.colors.white};
  }
`

export const Wrapper = styled.footer`
  padding: ${({ theme }) => `${theme.size.units(3)} 0`};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  ${Subtitle} {
    margin-top: ${({ theme }) => theme.size.units(2)};
  }
`

export const IconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.size.units(2)};
`

export const StyledIcon = styled.i`
  color: ${({ theme }) => theme.colors.white};
  width: ${({ theme }) => theme.size.units(3)};
  height: ${({ theme }) => theme.size.units(3)};
  transition: ${({ theme }) => theme.transition.standard()};

  &:hover {
    transform: scale(1.1);
  }
`
