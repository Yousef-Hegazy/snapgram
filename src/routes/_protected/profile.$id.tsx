import Followers from '@/components/shared/Followers'
import Followings from '@/components/shared/Followings'
import LikedPosts from '@/components/shared/LikedPosts'
import ProfileUserPosts from '@/components/shared/ProfileUserPosts'
import StatBlock from '@/components/shared/StatBlock'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthContext } from '@/context/AuthContext'
import useIsFollowing from '@/hooks/useIsFollowing'
import { useGetUserById } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart, List, PersonStanding, Users } from 'lucide-react'

export const Route = createFileRoute('/_protected/profile/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { user } = useAuthContext()
  const { data: profile, isPending } = useGetUserById(id)

  const { isFollowing, isCurrentUser } = useIsFollowing(user.id, profile)

  return (
    <div className="profile-container">
      {isPending ? (
        <Loader />
      ) : profile ? (
        <>
          <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
              <img
                src={
                  profile.imageUrl || '/assets/icons/profile-placeholder.svg'
                }
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
                  <StatBlock
                    value={profile.postCount > 99 ? '99+' : profile.postCount}
                    label="Posts"
                  />
                  <StatBlock
                    value={
                      profile.followersCount > 99
                        ? '99+'
                        : profile.followersCount
                    }
                    label="Followers"
                  />
                  <StatBlock
                    value={
                      profile.followeesCount > 99
                        ? '99+'
                        : profile.followeesCount
                    }
                    label="Following"
                  />
                  <StatBlock
                    value={profile.likeCount > 99 ? '99+' : profile.likeCount}
                    label="Likes"
                  />
                  <StatBlock
                    value={profile.saveCount > 99 ? '99+' : profile.saveCount}
                    label="Saves"
                  />
                </div>

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                  {profile.bio}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className={`${!isCurrentUser && `hidden`}`}>
                  <Link
                    to="/update-profile/$id"
                    params={{ id: profile.$id }}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                      !isCurrentUser && 'hidden'
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
                <div className={`${isCurrentUser && `hidden`}`}>
                  <Button
                    type="button"
                    className={cn('px-8', {
                      'shad-button_primary': !isFollowing,
                      'shad-button_dark_4': isFollowing,
                    })}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl">
            <Tabs defaultValue="my-posts" className="items-center gap-9">
              <TabsList className="rounded-md py-8">
                <TabsTrigger value="my-posts" className="profile-tab">
                  <List className="size-4" />
                  <span>Posts</span>
                </TabsTrigger>

                {isCurrentUser ? (
                  <>
                    <TabsTrigger value="liked-posts" className="profile-tab">
                      <Heart className="size-4" />
                      <span>Liked Posts</span>
                    </TabsTrigger>

                    <TabsTrigger value="followings" className="profile-tab">
                      <PersonStanding className="size-5" />
                      <span>Followings</span>
                    </TabsTrigger>

                    <TabsTrigger value="followers" className="profile-tab">
                      <Users className="size-4" />
                      <span>Followers</span>
                    </TabsTrigger>
                  </>
                ) : null}
              </TabsList>

              <TabsContent value="my-posts" className="w-full">
                <ProfileUserPosts userId={profile.$id} />
              </TabsContent>

              {isCurrentUser ? (
                <>
                  <TabsContent value="liked-posts" className="w-full">
                    <LikedPosts userId={profile.$id} />
                  </TabsContent>

                  <TabsContent value="followings" className="w-full">
                    <Followings userId={profile.$id} />
                  </TabsContent>

                  <TabsContent value="followers" className="w-full">
                    <Followers userId={profile.$id} />
                  </TabsContent>
                </>
              ) : null}
            </Tabs>
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  )
}
