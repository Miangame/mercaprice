import { useRouter } from 'next/router'
import useSWRInfinite from 'swr/infinite'

import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'
import {
  LoadMoreButton,
  ProductsWrapper,
  Title,
  Wrapper
} from '@/components/HomePage/HomePage.styled'
import { ProductCard } from '@/components/HomePage/components/ProductCard/ProductCard'
import { Loader } from '@/components/Loader/Loader'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = () => {
  const router = useRouter()

  const { search } = router.query

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null
    return search
      ? `/api/search?query=${search}&page=${pageIndex + 1}`
      : `/api/randomProducts?page=${pageIndex + 1}`
  }

  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false
    }
  )

  const products = data ? data.flatMap((page) => page.products) : []

  const hasMore = data ? data[data.length - 1]?.hasMore : true

  const handleClickItem = (itemId: string) => () => {
    router.push(`/product/${itemId}`)
  }

  const handleLoadMore = () => {
    setSize(size + 1)
  }

  if (error) return <ErrorComponent />

  return (
    <Wrapper>
      <Title>
        {search ? `Resultados de búsqueda para: '${search}'` : 'Productos'}
      </Title>
      <ProductsWrapper>
        {products?.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onClick={handleClickItem(item.id)}
          />
        ))}
      </ProductsWrapper>
      {hasMore && !isValidating && (
        <LoadMoreButton onClick={handleLoadMore} disabled={isValidating}>
          Cargar más
        </LoadMoreButton>
      )}
      {isValidating && <Loader />}
    </Wrapper>
  )
}

export default Home
