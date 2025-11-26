import ProfileUploader from '@/components/shared/ProfileUploader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/Loader'
import { Textarea } from '@/components/ui/textarea'
import { useGetUserForEdit, useUpdateUser } from '@/lib/react-query'
import { ProfileUpdateValidation } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useEffectEvent } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const Route = createFileRoute('/_protected/update-profile/$id')({
  component: RouteComponent,
})

type ProfileFieldTypes = z.infer<typeof ProfileUpdateValidation>

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const form = useForm<ProfileFieldTypes>({
    resolver: zodResolver(ProfileUpdateValidation),
  })

  const {
    data: user,
    isPending: isPendingUser,
    isError: isErrorUser,
  } = useGetUserForEdit(id)

  const setFormValues = useEffectEvent(() => {
    if (user && !isErrorUser) {
      form.reset({
        name: user.name,
        username: user.username || '',
        email: user.email,
        bio: user.bio || '',
      })
    }
  })

  useEffect(() => {
    setFormValues()
  }, [user, isErrorUser])

  const { mutate: updateUser, isPending: isLoadingUpdate } = useUpdateUser()

  const onSubmit = async (data: ProfileFieldTypes) => {
    updateUser({
      bio: data.bio,
      name: data.name,
      userId: id,
      file: data.file ? [data.file] : [],
      imageId: '',
      imageUrl: '',
    });
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {isPendingUser ? (
          <Loader />
        ) : !user || isErrorUser ? (
          <div>User not found</div>
        ) : (
          <>
            <div className="flex flex-start gap-3 justify-start w-full max-w-5xl">
              <img src="/icons/edit.svg" alt="edit" className="invert-white" />
              <h2 className="h3-bold md:h2-bold text-left w-full">
                Edit Profile
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
              >
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormControl>
                        <ProfileUploader
                          fieldChange={field.onChange}
                          mediaUrl={user.imageUrl}
                        />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Name</FormLabel>
                      <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="shad-input"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="shad-input"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          className="shad-textarea custom-scrollbar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 items-center justify-end">
                  <Button
                    type="button"
                    className="shad-button_dark_4"
                    onClick={() =>
                      navigate({
                        to: '/profile/$id',
                        params: { id },
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    disabled={isLoadingUpdate}
                  >
                    {isLoadingUpdate && <Loader />}
                    Update Profile
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}
