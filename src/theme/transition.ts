export const transition = {
  // Función existente
  standard: (firstProperty = 'all', ...restProperties: string[]) =>
    [firstProperty, ...restProperties]
      .map((property: string) => `${property} 0.2s cubic-bezier(0.4,0,0.4,1)`)
      .join(', '),

  // Easing curves
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // bouncy
  },

  // Duraciones en ms
  duration: {
    fastest: 150,
    fast: 200,
    normal: 300,
    slow: 400,
    slowest: 600
  },

  // Helpers para framer-motion spring animations
  spring: {
    smooth: { type: 'spring' as const, stiffness: 100, damping: 15 },
    bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },
    gentle: { type: 'spring' as const, stiffness: 60, damping: 12 }
  }
}
