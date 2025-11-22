import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/save"!</div>
}
