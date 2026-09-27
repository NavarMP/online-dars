import { createSearchParamsCache, parseAsString, parseAsStringEnum } from 'nuqs/server'

export const searchParams = {
  category: parseAsString.withDefault('All'),
  difficulty: parseAsStringEnum(['beginner', 'intermediate', 'advanced']),
  price: parseAsStringEnum(['all', 'free', 'paid']).withDefault('all'),
  instructor: parseAsString, // comma separated or single
  q: parseAsString,
  sort: parseAsStringEnum(['latest', 'popular', 'price_asc', 'price_desc', 'duration_asc', 'duration_desc', 'a_z', 'z_a']).withDefault('latest'),
  view: parseAsStringEnum(['grid', 'list']).withDefault('grid'),
}

export const searchParamsCache = createSearchParamsCache(searchParams)
