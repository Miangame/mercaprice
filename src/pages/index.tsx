import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const router = useRouter()
  const { search } = router.query

  const { data, error, isLoading } = useSWR(
    search ? `/api/search?query=${search}` : null,
    fetcher
  )

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Hubo un error al cargar los resultados.</p>
  console.log({ data })
  return (
    <>
      <h1>Next.js + TypeScript + Styled Components</h1>
    </>
  )
}
