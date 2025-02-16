import { FiLoader } from 'react-icons/fi'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme: { size } }) => size.units(10)};
`

export const StyledLoaderIcon = styled(FiLoader)`
  width: ${({ theme: { size } }) => size.units(5)};
  height: ${({ theme: { size } }) => size.units(5)};
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`
