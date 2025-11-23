import Loader from '@/components/ui/Loader'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const isAuth = await context.auth.checkAuth()

    if (!isAuth) {
      throw redirect({
        to: '/sign-in',
        replace: true,
      })
    } else {
      throw redirect({
        to: '/posts',
        replace: true,
      })
    }
  },
  component: App,
})

function App() {
  return <Loader />
}
