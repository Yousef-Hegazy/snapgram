import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  // beforeLoad: ({ context }) => {
  //   if (context.auth.isAuthenticated && !context.auth.isLoading) {
  //     throw redirect({
  //       to: '/posts',
  //     })
  //   }
  // },
  beforeLoad: async ({ context }) => {
    const isAuth = await context.auth.checkAuth()
    if (isAuth) {
      throw redirect({ to: '/posts' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-screen">
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img
        src="/images/side-img.svg"
        alt="Side Image"
        className="relative hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </main>
  )
}
