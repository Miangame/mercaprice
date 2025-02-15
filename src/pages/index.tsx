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

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1rem'
        }}
      >
        {data?.map((result: any) => (
          <div key={result.id}>
            <img
              src={result.image}
              alt={result.title}
              style={{ width: '100%' }}
            />
            <h2>{result.title}</h2>
            <p>{result.overview}</p>
          </div>
        ))}
      </div>
    </>
  )
}
