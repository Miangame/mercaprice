import styled from 'styled-components'

export const Wrapper = styled.div(({ theme: { size } }) => ({
  padding: size.units(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}))
