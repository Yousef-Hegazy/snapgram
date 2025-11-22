import PostForm from '@/components/shared/PostForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/posts/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 w-full">
      <div className="common-container">
        <div className="max-w-5xl mx-auto flex-start gap-3 w-full">
          <img
            src="/icons/add-post.svg"
            width={36}
            height={36}
            alt="Add Post"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm />
      </div>
    </div>
  )
}
