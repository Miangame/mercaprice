import { useRouter } from 'next/router'
import useSWR from 'swr'

import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'
import {
  ProductsWrapper,
  Title,
  Wrapper
} from '@/components/HomePage/HomePage.styled'
import { ProductCard } from '@/components/HomePage/components/ProductCard/ProductCard'
import { Loader } from '@/components/Loader/Loader'
import { ProductWithPrice } from '@/types/ProductWithPrice'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = () => {
  const router = useRouter()

  const { search } = router.query

  const url = search ? `/api/search?query=${search}` : '/api/randomProducts'

  const { data, error, isLoading } = useSWR<ProductWithPrice[]>(url, fetcher)

  const handleClickItem = (itemId: string) => () => {
    router.push(`/product/${itemId}`)
  }

  if (isLoading) return <Loader />
  if (error) return <ErrorComponent />

  return (
    <Wrapper>
      <Title>
        {search ? `Resultados de búsqueda para: '${search}'` : 'Productos'}
      </Title>
      <ProductsWrapper>
        {data?.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onClick={handleClickItem(item.id)}
          />
        ))}
      </ProductsWrapper>
    </Wrapper>
  )
}

export default Home
