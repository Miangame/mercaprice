export const transition = {
  standard: (firstProperty = 'all', ...restProperties: string[]) =>
    [firstProperty, ...restProperties]
      .map((property: string) => `${property} 0.2s cubic-bezier(0.4,0,0.4,1)`)
      .join(', ')
}
