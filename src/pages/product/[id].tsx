import { PriceHistory } from '@prisma/client'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { GetServerSideProps } from 'next'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { PricesChart } from '@/components/ProductPage/components/PricesChart/PricesChart'
import {
  ChartWrapper,
  FakeImage,
  LeftColumn,
  NutritionalInfoWrapper,
  Price,
  PricesHistoryWrapper,
  PricesWrapper,
  Subtitle,
  Title,
  ColumnsWrapper,
  Wrapper,
  StyledButton,
  CarouselWrapper
} from '@/components/ProductPage/ProductPage.styled'
import { OriginalProduct } from '@/types/OriginalProduct'
import { ProductWithPrice } from '@/types/ProductWithPrice'
import { OpenFoodFactsResponse } from '@/types/OpenFoodFactsResponse'
import { ProductImagesCarousel } from '@/components/ProductPage/components/ProductImagesCarousel/ProductImagesCarousel'

interface ProductPageProps {
  product: ProductWithPrice
  priceHistoryUnitPrices: { recordedAt: string; price: number }[]
  priceHistoryBulkPrices: { recordedAt: string; price: number }[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ProductPage = ({
  product,
  priceHistoryUnitPrices,
  priceHistoryBulkPrices
}: ProductPageProps) => {
  const { query } = useRouter()
  const { id } = query

  const { data: originalData } = useSWR<OriginalProduct>(
    id && product ? `/api/proxy/${product?.externalId}` : undefined,
    fetcher
  )

  const { data: nutritionalInfo } = useSWR<OpenFoodFactsResponse>(
    originalData && originalData?.ean
      ? `https://world.openfoodfacts.org/api/v2/product/${originalData.ean}.json`
      : undefined,
    fetcher
  )

  const filterNutriInfo =
    nutritionalInfo?.status !== 0
      ? [
          {
            label: 'Energía',
            key: 'energy_100g',
            unitKey: 'energy-kcal_unit',
            extraKey: 'energy-kcal_100g'
          },
          { label: 'Grasas', key: 'fat_100g', unitKey: 'fat_unit' },
          {
            label: 'Grasas saturadas',
            key: 'saturated-fat_100g',
            unitKey: 'saturated-fat_unit'
          },
          {
            label: 'Carbohidratos',
            key: 'carbohydrates_100g',
            unitKey: 'carbohydrates_unit'
          },
          { label: 'Azúcares', key: 'sugars_100g', unitKey: 'sugars_unit' },
          {
            label: 'Proteínas',
            key: 'proteins_100g',
            unitKey: 'proteins_unit'
          },
          { label: 'Sal', key: 'salt_100g', unitKey: 'salt_unit' },
          { label: 'Alcohol', key: 'alcohol_100g', unitKey: 'alcohol_unit' }
        ].filter(
          ({ key }) =>
            (nutritionalInfo?.product.nutriments as Record<string, any>)?.[
              key
            ] !== undefined
        )
      : []

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

  return (
    <Wrapper>
      <Title>{product?.displayName}</Title>
      <ColumnsWrapper>
        <LeftColumn>
          <CarouselWrapper>
            {originalData?.photos ? (
              <ProductImagesCarousel
                images={originalData?.photos?.map((photo) => photo.regular)}
              />
            ) : (
              <FakeImage />
            )}
          </CarouselWrapper>

          <PricesWrapper>
            <Subtitle>Información de precios</Subtitle>
            <Price>
              Precio unitario: <span>{product?.unitPrice}€</span>
            </Price>
            <Price>
              Precio por volumen: <span>{product?.bulkPrice}€</span> (
              {product?.referenceFormat})
            </Price>

            <StyledButton
              href={originalData?.share_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en tienda
              <FaExternalLinkAlt />
            </StyledButton>
          </PricesWrapper>

          <NutritionalInfoWrapper>
            <Subtitle>Información nutricional</Subtitle>
            {nutritionalInfo?.status !== 0 ? (
              <>
                {filterNutriInfo.map(({ label, key, unitKey, extraKey }) => {
                  const nutriments = nutritionalInfo?.product
                    .nutriments as Record<string, any>
                  return (
                    <p key={key}>
                      {label}:{' '}
                      <span>
                        {`${nutriments[key]} ${nutriments[unitKey] ?? ''}${extraKey ? ` | ${nutriments[extraKey] ?? ''}` : ''}`}
                      </span>
                    </p>
                  )
                })}
              </>
            ) : (
              <p>No hay información nutricional disponible.</p>
            )}
          </NutritionalInfoWrapper>
        </LeftColumn>

        <PricesHistoryWrapper>
          <ChartWrapper>
            {priceHistoryUnitPrices ? (
              <PricesChart
                title="Histórico de precios por unidad"
                priceHistory={priceHistoryUnitPrices}
              />
            ) : (
              <p>No hay historial de precios por unidad disponible.</p>
            )}
          </ChartWrapper>

          <ChartWrapper>
            {priceHistoryBulkPrices ? (
              <PricesChart
                title="Histórico de precios por volumen"
                priceHistory={priceHistoryBulkPrices}
              />
            ) : (
              <p>No hay historial de precios por volumen disponible.</p>
            )}
          </ChartWrapper>
        </PricesHistoryWrapper>
      </ColumnsWrapper>
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
        priceHistoryUnitPrices: prices.map((price: PriceHistory) => ({
          recordedAt: price.recordedAt,
          price: price.unitPrice
        })),
        priceHistoryBulkPrices: prices.map((price: PriceHistory) => ({
          recordedAt: price.recordedAt,
          price: price.bulkPrice
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return { notFound: true }
  }
}

export default ProductPage
