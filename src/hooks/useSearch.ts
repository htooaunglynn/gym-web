import { useState } from 'react'

export default function useSearch<T>(
  items: T[],
  predicate: (item: T, normalizedQuery: string) => boolean,
  initialQuery = ''
) {
  const [query, setQuery] = useState(initialQuery)
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = normalizedQuery
    ? items.filter((item) => predicate(item, normalizedQuery))
    : items

  return {
    query,
    setQuery,
    normalizedQuery,
    filtered,
  }
}
