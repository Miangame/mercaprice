import { PriceHistory } from '@prisma/client'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { GetServerSideProps } from 'next'

import { PricesChart } from '@/components/ProductPage/components/PricesChart/PricesChart'
import {
  FakeImage,
  Price,
  PricesHistoryWrapper,
  PricesWrapper,
  SecondPrice,
  StyledImage,
  Title,
  Wrapper
} from '@/components/ProductPage/ProductPage.styled'
import { OriginalProduct } from '@/types/OriginalProduct'
import { ProductWithPrice } from '@/types/ProductWithPrice'

interface ProductPageProps {
  product: ProductWithPrice
  priceHistory: PriceHistory[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ProductPage = ({ product, priceHistory }: ProductPageProps) => {
  const { query } = useRouter()
  const { id } = query

  const { data: originalData } = useSWR<OriginalProduct>(
    id && product ? `/api/proxy/${product?.externalId}` : undefined,
    fetcher
  )

  const updateProduct = useCallback(async () => {
    const response = await fetch('/api/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, originalData })
    })

    if (!response.ok) {
      console.error('Error updating product')
    } else {
      console.log('✅ Product updated')
    }
  }, [product, originalData])

  useEffect(() => {
    const currentUnitPrice = parseFloat(
      originalData?.price_instructions.unit_price || '0'
    )
    const currentBulkPrice = parseFloat(
      originalData?.price_instructions.bulk_price || '0'
    )

    if (
      originalData &&
      product &&
      (originalData.display_name !== product.displayName ||
        (originalData.photos[0] &&
          originalData.photos[0].regular &&
          originalData.photos[0].regular !== product.image) ||
        product.unitPrice !== currentUnitPrice ||
        product.bulkPrice !== currentBulkPrice)
    ) {
      updateProduct()
    }
  }, [product, originalData, updateProduct])

  // if (error) return <ErrorComponent />
  // if (isLoading || !id) return <Loader />

  return (
    <Wrapper>
      {product?.image ? (
        <StyledImage src={product.image} alt={product?.displayName} />
      ) : (
        <FakeImage />
      )}
      <Title>{product?.displayName}</Title>
      <PricesWrapper>
        <Price>
          {product?.unitPrice}€<span>/unidad</span>
        </Price>
        <SecondPrice>
          {product?.bulkPrice}€<span>/{product?.referenceFormat}</span>
        </SecondPrice>
      </PricesWrapper>
      <PricesHistoryWrapper>
        {priceHistory ? (
          <>
            <PricesChart
              title="Histórico de precios por unidad"
              priceHistory={priceHistory}
            />
            <PricesChart
              title="Histórico de precios al por mayor"
              priceHistory={priceHistory}
            />
          </>
        ) : (
          <p>No hay historial de precios disponible.</p>
        )}
      </PricesHistoryWrapper>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const productId = params?.id
  if (!productId) return { notFound: true }

  try {
    const [productRes, pricesRes] = await Promise.all([
      fetch(`${process.env.API_URL}/api/product/${productId}`),
      fetch(`${process.env.API_URL}/api/prices/${productId}`)
    ])

    const [product, prices] = await Promise.all([
      productRes.json(),
      pricesRes.json()
    ])

    if (!product || product.error) {
      return { notFound: true }
    }

    return {
      props: {
        product,
        priceHistory: prices
      }
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return { notFound: true }
  }
}

export default ProductPage
