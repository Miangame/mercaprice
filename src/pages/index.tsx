import { useRouter } from 'next/router'
import useSWR from 'swr'

import { Loader } from '@/components/Loader/Loader'
import {
  Title,
  ProductsWrapper,
  Wrapper
} from '@/components/HomePage/HomePage.styled'
import { ProductCard } from '@/components/HomePage/components/ProductCard/ProductCard'
import { ProductWithPrice } from '@/types/ProductWithPrice'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const router = useRouter()
  const { search } = router.query

  const url = search ? `/api/search?query=${search}` : '/api/randomProducts'

  const { data, error, isLoading } = useSWR<ProductWithPrice[]>(url, fetcher)

  if (isLoading) return <Loader />
  if (error) return <p>Hubo un error al cargar los resultados.</p>

  return (
    <Wrapper>
      <Title>
        {search ? `Resultados de búsqueda para: '${search}'` : 'Productos'}
      </Title>
      <ProductsWrapper>
        {data?.map((item) => <ProductCard key={item.id} item={item} />)}
      </ProductsWrapper>
    </Wrapper>
  )
}
