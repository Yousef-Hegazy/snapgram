import { PostStats } from '@/components/shared/PostCard/PostStats'
import { DeletePostDialog } from '@/components/shared/DeletePostDialog'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { formatTimeAgo } from '@/lib/helpers/dateHelpers'
import { useDeletePost, useGetPostDetails } from '@/lib/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/posts/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { user } = useAuthContext()
  const { data: post, isPending, error } = useGetPostDetails(id)

  const navigate = useNavigate()
  const deletePostMutation = useDeletePost()

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : !post || error ? (
        <div>Post not found</div>
      ) : (
        <div className="post_details-card">
          <img
            src={post.imageUrl}
            alt={post.caption || 'post'}
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                className="flex items-center gap-3"
                to="/profile/$id"
                params={{ id: post.creator.$id }}
              >
                <img
                  src={
                    post.creator.imageUrl || '/icons/profile-placeholder.svg'
                  }
                  alt="creator"
                  width={48}
                  height={48}
                  className="rounded-full"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formatTimeAgo(post.$createdAt)}
                    </p>
                    <p>-</p>
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-2">
                {user.id === post.creator.$id ? (
                  <>
                    <Link to="/posts/$id/edit" params={{ id: post.$id }}>
                      <img
                        src="/icons/edit.svg"
                        alt="edit"
                        width={24}
                        height={24}
                      />
                    </Link>

                    <DeletePostDialog
                      onDelete={() => {
                        deletePostMutation.mutate(
                          { postId: id, userId: user.id },
                          {
                            onSuccess: () => {
                              navigate({ to: '/posts' })
                            },
                          },
                        )
                      }}
                      isPending={deletePostMutation.isPending}
                    >
                      <Button
                        variant="ghost"
                        className="post_details-delete_btn!"
                      >
                        <img
                          src="/icons/delete.svg"
                          alt="delete"
                          width={24}
                          height={24}
                        />
                      </Button>
                    </DeletePostDialog>
                  </>
                ) : null}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags?.map((tag) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
