import { default as NextHead } from 'next/head'

export const Head = () => {
  return (
    <NextHead>
      <title>Mercaprice</title>
      <meta
        name="description"
        content="Analiza el precio de los productos de Mercadona"
      />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
      />
    </NextHead>
  )
}
