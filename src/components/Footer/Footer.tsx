import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

import { IconsWrapper, StyledIcon, Subtitle, Wrapper } from './Footer.styled'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <Wrapper>
      <IconsWrapper>
        <a
          href="https://github.com/Miangame/mercaprice"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon as={FaGithub} />
        </a>
        <a
          href="https://x.com/miguel5gavilan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon as={FaXTwitter} />
        </a>
      </IconsWrapper>
      <Subtitle>
        © {year} Mercaprice | Made by a{' '}
        <a
          href="https://x.com/miguel5gavilan"
          target="_blank"
          rel="noopener noreferrer"
        >
          Miangame
        </a>
      </Subtitle>
    </Wrapper>
  )
}
