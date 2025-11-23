import PostCard from '@/components/shared/PostCard'
import UserCard from '@/components/shared/UserCard'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { useGetPosts, useGetUsers } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/posts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthContext()

  const { data: posts, isPending: loadingPosts, isError: isErrorPosts } = useGetPosts()
  const { data: creators, isPending: loadingUsers, isError: isErrorCreators } = useGetUsers(10)

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {loadingPosts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts
                ? posts.map((p) => (
                    <PostCard key={p.$id} post={p} currentUser={user} />
                  ))
                : null}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {loadingUsers ? (
          <Loader />
        ) : creators ? (
          <ul className='grid 2xl:grid-cols-2 gap-6'>
            {creators.map((creator) => (
              <li key={creator.$id}>
                <UserCard user={creator} currentUserId={user.id} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
