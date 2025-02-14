import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'

import { useDebounce } from '@/hooks/useDebounce'

export const Header = () => {
  const router = useRouter()

  const [searchText, setSearchText] = useState('')

  const commitChanges = (value: string) => {
    router.push(
      {
        pathname: '/',
        query: value ? { search: value } : undefined
      },
      undefined,
      { shallow: true }
    )
  }

  const debounceCommitChanges = useDebounce(commitChanges)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value

    setSearchText(text)
    debounceCommitChanges(text)
  }

  return (
    <input
      type="text"
      value={searchText}
      placeholder="Search..."
      onChange={handleChange}
    />
  )
}
