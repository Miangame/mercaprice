import styled from 'styled-components'

const StyledBaseButton = styled.button`
  display: block;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  transition: ${({ theme }) => theme.transition.standard()};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.1)')};
  }
`

export const NextButton = styled(StyledBaseButton)`
  position: absolute;
  top: 50%;
  right: 0;
`

export const PrevButton = styled(StyledBaseButton)`
  position: absolute;
  top: 50%;
  left: 0;
`
