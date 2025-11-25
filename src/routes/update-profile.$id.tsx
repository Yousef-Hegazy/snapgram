import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/update-profile/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/update-profile/$id"!</div>
}
