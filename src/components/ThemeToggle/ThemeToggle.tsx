import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import styled from 'styled-components'

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primaryGradient};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.colors.shadow.colored};
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(34, 158, 107, 0.5);
  }
`

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ToggleButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
    </ToggleButton>
  )
}
