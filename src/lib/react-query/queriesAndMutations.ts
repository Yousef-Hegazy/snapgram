import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AppwriteException } from 'appwrite'
import type { Posts } from 'appwrite/types/appwrite'
import { toast } from 'sonner'

import { QUERY_KEYS } from './queryKeys'

import {
  createUserAccount,
  getCurrentUser,
  logout,
  signInAccount,
} from '@/lib/appwrite/authUtils'
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  likePost,
  savePost,
} from '@/lib/appwrite/postUtils'

import type { INewPost } from '@/types'

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: createUserAccount,
    onError: (error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export const useSignInAccount = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signInAccount,
    onSuccess: () => {
      navigate({
        to: '/',
        replace: true,
      })
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
        return
      }
      toast.error(
        error.message || 'Failed to sign in, please try again or contact us.',
      )
    },
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (routeAfterSuccess?: string) => {
      await logout()
      return routeAfterSuccess || '/sign-in'
    },
    onSuccess: (routeAfterSuccess) => {
      navigate({
        to: routeAfterSuccess,
        replace: true,
      })
    },
  })
}

export const useCreatePost = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: INewPost) =>
      createPost({
        file: post.file[0] || null,
        caption: post.caption,
        location: post.location,
        tags: post.tags,
        userId: post.userId,
      }),
    onSuccess: async () => {
      toast.success('Post created successfully')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
      navigate({
        to: '/',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post')
    },
  })
}

export const useEditPost = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: INewPost & { id: string }) =>
      editPost({
        id: post.id,
        caption: post.caption,
        location: post.location,
        tags: post.tags,
        file: post.file[0] || undefined,
        userId: post.userId,
      }),
    onSuccess: async () => {
      toast.success('Post updated successfully')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
      navigate({
        to: '/',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post')
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      postId,
      imageId,
    }: {
      postId: string
      imageId: string
    }) => deletePost(postId, imageId),
    onSuccess: async () => {
      toast.success('Post deleted successfully')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post')
    },
  })
}

export const useGetPosts = ({ initialData }: { initialData: Array<Posts> }) => {
  return useQuery({
    initialData,
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: getPosts,
    staleTime: 1000 * 60, // 1 minutes
    refetchOnMount: 'always',
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to like post')
    },
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: savePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save post')
    },
  })
}
