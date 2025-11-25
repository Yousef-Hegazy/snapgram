import GridPostList from '@/components/shared/GridPostList'
import InfiniteQueryContainer from '@/components/shared/InfiniteQueryContainer'
import SearchResults from '@/components/shared/SearchResults'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/Loader'
import { useGetInfinitePosts, useSearchPosts } from '@/lib/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'

export const Route = createFileRoute('/_protected/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  const [query, setQuery] = useState('')

  const {
    data: posts,
    isPending: isPendingPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts()

  const debouncedQuery = useDebounce(query, 500)

  const { data: searchResults, isPending: isPendingSearch } =
    useSearchPosts(debouncedQuery)

  const showSearchResults = debouncedQuery !== ''
  const showPosts =
    !showSearchResults &&
    posts &&
    posts.pages.every((page) => page.rows.length === 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/icons/search.svg" width={24} height={24} alt="search" />

          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>

          <img src="/icons/filter.svg" width={20} height={20} alt="filter" />
        </div>
      </div>

      <InfiniteQueryContainer
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        shouldFetch={!debouncedQuery}
      >
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {showSearchResults ? (
            <SearchResults
              isLoading={isPendingSearch}
              posts={searchResults || []}
            />
          ) : showPosts ? (
            <p className="text-light-4 mt-10 text-center w-full">
              End of posts
            </p>
          ) : isPendingPosts ? (
            <Loader />
          ) : !posts ? (
            <div></div>
          ) : (
            posts.pages.map((page, index) => (
              <GridPostList key={`page-${index}`} posts={page.rows} />
            ))
          )}
        </div>
      </InfiniteQueryContainer>
    </div>
  )
}
