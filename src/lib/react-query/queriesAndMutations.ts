import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AppwriteException } from 'appwrite'
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
  getInfinitePosts,
  getPostDetails,
  getPostForEdit,
  getPosts,
  likePost,
  savePost,
  searchPosts,
} from '@/lib/appwrite/postUtils'

import { INITIAL_USER, useAuthContext } from '@/context/AuthContext'
import type { INewPost } from '@/types'

export const useCreateUserAccount = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: createUserAccount,
    onSuccess: () => {
      navigate({
        to: '/posts',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export const useSignInAccount = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated } = useAuthContext()

  return useMutation({
    mutationFn: signInAccount,
    onSuccess: (data) => {
      setUser({
        id: data.$id,
        name: data.name,
        username: data.username || '',
        email: data.email,
        imageUrl: data.imageUrl,
        bio: data.bio || '',
      })

      setIsAuthenticated(true)

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], data)

      navigate({
        to: '/posts',
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
    staleTime: 300_000, // 5 minutes
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated } = useAuthContext()
  return useMutation({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: async () => {
      setUser(INITIAL_USER)
      setIsAuthenticated(false)

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], null)

      navigate({
        to: '/sign-in',
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
      userId,
    }: {
      postId: string
      userId: string
    }) => await deletePost(postId, userId),
    onSuccess: async () => {
      toast.success('Post deleted successfully')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post')
    },
  })
}

export const useGetPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: getPosts,
    staleTime: 1000 * 60, // 1 minutes
    refetchOnMount: 'always',
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      likePost(postId, userId),
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
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string
      userId: string
    }) => await savePost(postId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save post')
    },
  })
}

export const useGetPostForEdit = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostForEdit(postId),
    staleTime: 1000 * 60, // 1 minutes
    refetchOnMount: 'always',
  })
}

export const useGetPostDetails = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, postId],
    queryFn: () => getPostDetails(postId),
    staleTime: 1000 * 60, // 1 minutes
    refetchOnMount: 'always',
  })
}

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }) => getInfinitePosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.rows.length === 0) return null
      // const nextPage = Number(lastPageParam) + 1
      // if (nextPage > allPages.length) return null
      // return nextPage.toString()
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id

      return lastId
    },
    initialPageParam: '0',
  })
}

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, query],
    queryFn: () => searchPosts(query),
    staleTime: 1000 * 60, // 1 minutes
    enabled: !!query,
  })
}
