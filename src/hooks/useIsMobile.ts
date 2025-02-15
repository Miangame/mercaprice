import { useState, useEffect } from 'react'

import { BREAKPOINT_MD } from '@/theme/media'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINT_MD})`)

    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile() // Verifica el estado inicial
    mediaQuery.addEventListener('change', updateIsMobile)

    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  return isMobile
}
