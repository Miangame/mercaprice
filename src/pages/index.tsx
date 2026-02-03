import { useRouter } from 'next/router'
import useSWRInfinite from 'swr/infinite'
import { motion, AnimatePresence } from 'framer-motion'

import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'
import {
  LoadMoreButton,
  ProductsWrapper,
  Title,
  Wrapper
} from '@/components/HomePage/HomePage.styled'
import { ProductCard } from '@/components/HomePage/components/ProductCard/ProductCard'
import { Loader } from '@/components/Loader/Loader'
import { ProductGridSkeleton } from '@/components/Skeletons/ProductGridSkeleton'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = () => {
  const router = useRouter()

  const { search } = router.query

  const searchQuery = search ? search.toString().trim() : ''

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null
    return searchQuery
      ? `/api/search?query=${searchQuery}&page=${pageIndex + 1}`
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

  // Variants para el container con stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          {searchQuery
            ? `Resultados de búsqueda para: '${searchQuery}'`
            : 'Productos'}
        </Title>
      </motion.div>

      {!data && isValidating ? (
        <ProductGridSkeleton count={20} />
      ) : (
        <ProductsWrapper
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {products
              ?.filter((p) => !!p)
              .map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onClick={handleClickItem(item.id)}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </ProductsWrapper>
      )}

      {hasMore && !isValidating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoadMoreButton onClick={handleLoadMore} disabled={isValidating}>
            Cargar más
          </LoadMoreButton>
        </motion.div>
      )}

      {isValidating && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader />
        </motion.div>
      )}
    </Wrapper>
  )
}

export default Home
