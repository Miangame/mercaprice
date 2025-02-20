import { useRouter } from 'next/router'
import useSWR from 'swr'
import { GetServerSideProps } from 'next'

import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'
import {
  ProductsWrapper,
  Title,
  Wrapper
} from '@/components/HomePage/HomePage.styled'
import { ProductCard } from '@/components/HomePage/components/ProductCard/ProductCard'
import { Loader } from '@/components/Loader/Loader'
import { ProductWithPrice } from '@/types/ProductWithPrice'

interface HomeProps {
  initialData: ProductWithPrice[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = ({ initialData }: HomeProps) => {
  const router = useRouter()

  const { search } = router.query

  const { data, error, isLoading } = useSWR<ProductWithPrice[]>(
    search ? `/api/search?query=${search}` : null,
    fetcher
  )

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
        {(search ? data : initialData)?.map((item) => (
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/randomProducts`)
    if (!res.ok) throw new Error('Failed to fetch random products')

    const data = await res.json()

    return {
      props: { initialData: data }
    }
  } catch (error) {
    console.error('Error fetching random products:', error)
    return {
      props: { initialData: [] }
    }
  }
}

export default Home
