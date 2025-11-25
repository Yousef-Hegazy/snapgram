import StatBlock from '@/components/shared/StatBlock'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import { useAuthContext } from '@/context/AuthContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { user } = useAuthContext()
  const { data: profile, isPending } = useGetUserById(id)

  return (
    <div className="profile-container">
      {isPending ? (
        <Loader />
      ) : profile ? (
        <div className="profile-inner_container">
          <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img
              src={profile.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            />

            <div className="flex flex-col flex-1 justify-between md:mt-2">
              <div className="flex flex-col w-full">
                <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                  {profile.name}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{profile.username}
                </p>
              </div>

              <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                <StatBlock value={profile.postCount} label="Posts" />
                <StatBlock value={profile.followersCount} label="Followers" />
                <StatBlock value={profile.followeesCount} label="Following" />
              </div>

              <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                {profile.bio}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <div className={`${user.id !== profile.$id && 'hidden'}`}>
                <Link
                  to="/update-profile/$id"
                  params={{ id: profile.$id }}
                  className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                    user.id !== profile.$id && 'hidden'
                  }`}
                >
                  <img
                    src={'/icons/edit.svg'}
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="flex whitespace-nowrap small-medium">
                    Edit Profile
                  </p>
                </Link>
              </div>
              <div className={`${user.id === id && 'hidden'}`}>
                <Button type="button" className="shad-button_primary px-8">
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  )
}
