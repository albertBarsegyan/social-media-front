import type { Page } from "./types"

/** Follows `nextCursor` until the end (or `maxPages`) for bounded lists such as one calendar week. */
export async function fetchAllPages<T>(load: (cursor?: string) => Promise<Page<T>>, maxPages = 20): Promise<T[]> {
  const items: T[] = []
  let cursor: string | undefined
  for (let page = 0; page < maxPages; page++) {
    const result = await load(cursor)
    items.push(...result.items)
    if (!result.nextCursor) break
    cursor = result.nextCursor
  }
  return items
}

/** Options shared by every cursor-paginated `useInfiniteQuery`. */
export const cursorPaging = {
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (last: Page<unknown>) => last.nextCursor ?? undefined,
}
