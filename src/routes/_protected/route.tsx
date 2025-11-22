import Bottombar from '@/components/ui/Bottombar'
import LeftSidebar from '@/components/ui/LeftSidebar'
import Topbar from '@/components/ui/Topbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  // beforeLoad: ({ context, location }) => {
  //   if (!context.auth.isAuthenticated && !context.auth.isLoading) {
  //     throw redirect({
  //       to: '/sign-in',
  //       search: {
  //         // Save current location for redirect after login
  //         redirect: location.href,
  //       },
  //     })
  //   }
  // },
  beforeLoad: async ({ context }) => {
    const isAuth = await context.auth.checkAuth()
    if (!isAuth) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full md:flex flex-col">
      <Topbar />

      <section className="flex flex-1 h-full">
        <LeftSidebar />
        <main className="flex h-screen flex-1">
          <Outlet />
        </main>
      </section>

      <Bottombar />
    </div>
  )
}
