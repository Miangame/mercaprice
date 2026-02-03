import { motion } from 'framer-motion'
import styled from 'styled-components'
import { ReactNode } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  className?: string
}

const StyledButton = styled(motion.button)<{ $variant: string }>`
  border: none;
  border-radius: 50px;
  color: ${({ theme, $variant }) =>
    $variant === 'ghost' ? theme.colors.primary : theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.size.units(2)};
  font-weight: 600;
  padding: ${({ theme }) => `${theme.size.units(2)} ${theme.size.units(6)}`};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  background: ${({ theme, $variant }) => {
    if ($variant === 'primary') return theme.colors.primaryGradient
    if ($variant === 'secondary') return theme.colors.accentGradient
    return 'transparent'
  }};

  box-shadow: ${({ theme, $variant }) =>
    $variant === 'ghost' ? 'none' : theme.colors.shadow.colored};

  border: ${({ theme, $variant }) =>
    $variant === 'ghost' ? `2px solid ${theme.colors.primary}` : 'none'};

  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const LoadingSpinner = styled(motion.div)`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const AnimatedButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  loading = false,
  className
}: AnimatedButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled || loading}
      $variant={variant}
      className={className}
      whileHover={
        !disabled && !loading
          ? {
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(34, 158, 107, 0.4)'
            }
          : {}
      }
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
    >
      {loading ? <LoadingSpinner /> : children}
    </StyledButton>
  )
}
