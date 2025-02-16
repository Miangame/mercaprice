import { PriceHistory } from '@prisma/client'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import useSWR from 'swr'

import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'
import { Loader } from '@/components/Loader/Loader'
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ProductPage = () => {
  const { query } = useRouter()
  const { id } = query

  const { data, isLoading, error } = useSWR<ProductWithPrice>(
    id ? `/api/product/${id}` : undefined,
    fetcher
  )

  const { data: originalData } = useSWR<OriginalProduct>(
    id && data ? `/api/proxy/${data?.externalId}` : undefined,
    fetcher
  )

  const { data: priceHistory } = useSWR<PriceHistory[]>(
    id && data ? `/api/prices/${data?.id}` : undefined,
    fetcher
  )

  const updateProduct = useCallback(async () => {
    const response = await fetch('/api/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, originalData })
    })

    if (!response.ok) {
      console.error('Error updating product')
    } else {
      console.log('✅ Product updated')
    }
  }, [data, originalData])

  useEffect(() => {
    const currentUnitPrice = parseFloat(
      originalData?.price_instructions.unit_price || '0'
    )
    const currentBulkPrice = parseFloat(
      originalData?.price_instructions.bulk_price || '0'
    )

    if (
      originalData &&
      data &&
      (originalData.display_name !== data.displayName ||
        (originalData.photos[0] &&
          originalData.photos[0].regular &&
          originalData.photos[0].regular !== data.image) ||
        data.unitPrice !== currentUnitPrice ||
        data.bulkPrice !== currentBulkPrice)
    ) {
      updateProduct()
    }
  }, [data, originalData, updateProduct])

  if (error) return <ErrorComponent />
  if (isLoading || !id) return <Loader />

  return (
    <Wrapper>
      {data?.image ? (
        <StyledImage src={data.image} alt={data?.displayName} />
      ) : (
        <FakeImage />
      )}
      <Title>{data?.displayName}</Title>
      <PricesWrapper>
        <Price>
          {data?.unitPrice}€<span>/unidad</span>
        </Price>
        <SecondPrice>
          {data?.bulkPrice}€<span>/{data?.referenceFormat}</span>
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

export default ProductPage
