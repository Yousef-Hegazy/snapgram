import GridPostList from '@/components/shared/GridPostList'
import InfiniteQueryContainer from '@/components/shared/InfiniteQueryContainer'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { useGetInfiniteSaves } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthContext()

  const {
    data: saved,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteSaves(user.id)

  return (
    <InfiniteQueryContainer
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      shouldFetch
    >
      <div className="saved-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/icons/save.svg"
            width={36}
            height={36}
            alt="saves"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Saved posts</h2>
        </div>

        {isPending ? (
          <Loader />
        ) : saved && saved.pages.length > 0 ? (
          <ul className="w-full flex justify-center max-w-5xl gap-9">
            {saved.pages.map((page, pageIndex) => (
              <GridPostList
                key={`page-${pageIndex}`}
                posts={page.rows}
                showStats={false}
              />
            ))}
          </ul>
        ) : (
          <p className="text-light-4">No available posts</p>
        )}
      </div>
    </InfiniteQueryContainer>
  )
}
