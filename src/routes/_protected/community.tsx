import InfiniteQueryContainer from '@/components/shared/InfiniteQueryContainer'
import UserCard from '@/components/shared/UserCard'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { useInfiniteUsers } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/community')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user: currentUser } = useAuthContext()

  const {
    data: users,
    hasNextPage,
    fetchNextPage,
    isPending,
  } = useInfiniteUsers(10)

  return (
    <div className="common-container">
      <InfiniteQueryContainer
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      >
        <div className="user-container">
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>

          {isPending ? (
            <Loader />
          ) : users?.pages ? (
            <ul className="user-grid">
              {users.pages.map((page) =>
                page.rows.map((user) => (
                  <UserCard
                    key={user.$id}
                    user={user}
                    currentUserId={currentUser.id}
                  />
                )),
              )}
            </ul>
          ) : (
            <p className="text-light-2 mt-4">No users found.</p>
          )}
        </div>
      </InfiniteQueryContainer>
    </div>
  )
}
