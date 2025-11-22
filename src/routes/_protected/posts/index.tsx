import PostCard from '@/components/shared/PostCard'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { useGetPosts } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/posts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthContext()

  const { data: posts, isPending: loadingPosts } = useGetPosts()

  return (
    <div className="flex flex-1">
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
    </div>
  )
}
