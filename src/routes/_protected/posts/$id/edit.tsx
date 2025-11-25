import PostForm from '@/components/shared/PostForm'
import Loader from '@/components/ui/Loader'
import { useGetPostForEdit } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/posts/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: post, isPending } = useGetPostForEdit(id)

  return (
    <div className="flex flex-1 w-full">
      <div className="common-container">
        <div className="max-w-5xl mx-auto flex-start gap-3 w-full">
          <img src="/icons/edit.svg" width={36} height={36} alt="Edit Post" className='invert-white' />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isPending ? (
          <Loader />
        ) : post ? (
          <PostForm post={post} />
        ) : (
          <p className="text-center font-semibold text-lg mt-10 text-light-1">
            Post not found.
          </p>
        )}
      </div>
    </div>
  )
}
