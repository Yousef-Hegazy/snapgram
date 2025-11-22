import { account, appwriteConfig, database, storage } from '@/appwrite/config'
import type { Likes, Posts, Saves } from '@/appwrite/types/appwrite'
import { ID, ImageGravity, Query } from 'appwrite'

import { deleteFile, uploadFile } from './storageUtils'

export async function getPosts() {
  try {
    const posts = await database.listRows<Posts>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postsTableId,
      queries: [
        Query.orderDesc('$createdAt'),
        Query.limit(20),
        Query.select(['*', 'creator.*', 'likes.user', 'save.user']),
      ],
    })

    return posts.rows
  } catch {
    return []
  }
}

export async function getPostForEdit(postId: string) {
  const post = await database.getRow<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
    queries: [
      Query.select(['imageId', 'imageUrl', 'caption', 'location', 'tags']),
    ],
  })

  if (!post.$id) throw new Error('Post not found')

  return post
}

export async function getPostById(postId: string) {
  try {
    const post = await database.getRow<Posts>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postsTableId,
      rowId: postId,
      queries: [Query.select(['*'])],
    })

    return post
  } catch {
    return null
  }
}

export async function createPost({
  file,
  caption,
  location,
  tags,
  userId,
}: {
  file: File | undefined | null
  caption: string
  location?: string
  tags?: Array<string>
  userId: string
}) {
  let imageId = ''
  let imageUrl = ''

  if (file && file.size > 0) {
    const uploadedFile = await uploadFile(file)

    const fileUrl = storage.getFilePreview({
      bucketId: appwriteConfig.storageId,
      fileId: uploadedFile.$id,
      width: 2000,
      height: 2000,
      gravity: ImageGravity.Top,
      quality: 100,
    })

    imageId = uploadedFile.$id
    imageUrl = fileUrl
  }

  const post = await database.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: ID.unique(),
    data: {
      caption,
      location: location || null,
      tags: tags || [],
      imageId,
      imageUrl,
      creator: userId,
    },
  })

  if (!post.$id) {
    if (imageId) {
      await deleteFile(imageId)
    }

    throw new Error('Post creation failed')
  }

  return post
}

export async function editPost({
  id,
  caption,
  location,
  tags,
  file,
  userId,
}: {
  id: string
  caption: string
  location?: string
  tags?: Array<string>
  file?: File
  userId: string
}) {
  const existingPost = await database.getRow<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: id,
    queries: [Query.select(['creator', 'imageId', 'imageUrl'])],
  })

  if (!existingPost.$id) throw new Error('Post not found')

  if (existingPost.creator.toString() !== userId)
    throw new Error('You are not authorized to edit this post')

  let imageId = existingPost.imageId
  let imageUrl = existingPost.imageUrl

  if (file && file.size > 0) {
    const uploadedFile = await uploadFile(file)

    const fileUrl = storage.getFilePreview({
      bucketId: appwriteConfig.storageId,
      fileId: uploadedFile.$id,
      width: 2000,
      height: 2000,
      gravity: ImageGravity.Top,
      quality: 100,
    })

    imageId = uploadedFile.$id
    imageUrl = fileUrl
  }

  const post = await database.updateRow<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: id,
    data: {
      caption,
      location: location || existingPost.location,
      tags: tags || existingPost.tags,
      imageId,
      imageUrl,
    },
  })

  if (!post.$id) {
    if (imageId && imageId !== existingPost.imageId) {
      await deleteFile(imageId)
    }

    throw new Error('Post update failed')
  }

  if (imageId !== existingPost.imageId) {
    await deleteFile(existingPost.imageId)
  }

  return post
}

export async function deletePost(postId: string, imageId: string) {
  await database.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
  })

  await deleteFile(imageId)

  return null
}

export async function removeLikeById(likeId: string, postId: string) {
  await database.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.likesTableId,
    rowId: likeId,
  })

  await database.decrementRowColumn<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
    column: 'likesCount',
    value: 1,
  })
}

export async function getLikeByPostAndUser(postId: string, userId: string) {
  try {
    const likes = await database.listRows<Likes>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.likesTableId,
      queries: [
        Query.equal('post', postId),
        Query.equal('user', userId),
        Query.limit(1),
      ],
    })

    if (likes.total === 0) {
      throw new Error('Like not found')
    }

    return likes.rows[0]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function addLike(postId: string, userId: string) {
  const createdLike = await database.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.likesTableId,
    rowId: ID.unique(),
    data: {
      post: postId,
      user: userId,
    },
  })

  if (!createdLike.$id) {
    throw new Error('Failed to like the post')
  }

  return createdLike
}

export async function likePost(postId: string, userId: string) {
  const post = await database.getRow<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
    queries: [Query.select(['likes.$id', 'likes.user'])],
  })

  if (!post.$id) throw new Error('Post not found')

  const existingLike = post.likes.find(
    (like: any) => like.user.toString() === userId,
  )

  if (existingLike) {
    await removeLikeById(existingLike.$id, postId)
    return null
  } else {
    const createdLike = await addLike(postId, userId)

    if (!createdLike.$id) {
      throw new Error('Failed to like the post')
    }

    await database.incrementRowColumn<Posts>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postsTableId,
      rowId: postId,
      column: 'likesCount',
      value: 1,
    })
    return createdLike
  }
}

export async function getSaveByPostAndUser(postId: string, userId: string) {
  try {
    const saves = await database.listRows<Saves>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.savesTableId,
      queries: [
        Query.equal('post', postId),
        Query.equal('user', userId),
        Query.limit(1),
      ],
    })

    return saves.rows[0]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createSave(postId: string, userId: string) {
  const createdSave = await database.createRow<Saves>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.savesTableId,
    rowId: ID.unique(),
    data: {
      post: postId as any,
      user: userId as any,
    },
  })

  if (!createdSave.$id) {
    throw new Error('Failed to save the post')
  }

  // Update post saves after create
  await database.incrementRowColumn<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
    column: 'savesCount',
    value: 1,
  })

  return createdSave
}

export async function deleteSaveById(saveId: string, postId: string) {
  await database.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.savesTableId,
    rowId: saveId,
  })

  await database.decrementRowColumn<Posts>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.postsTableId,
    rowId: postId,
    column: 'savesCount',
    value: 1,
  })

  return null
}

export async function savePost(postId: string, userId: string) {
  const existingSave = await getSaveByPostAndUser(postId, userId)

  if (existingSave?.$id) {
    return await deleteSaveById(existingSave.$id, postId)
  } else {
    return await createSave(postId, userId)
  }
}
