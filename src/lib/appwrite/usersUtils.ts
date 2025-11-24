import { appwriteConfig, database } from '@/appwrite/config'
import type { Follows, Users } from '@/appwrite/types/appwrite'
import { ID, Query } from 'appwrite'

export async function getUsers(limit?: number) {
  const queries = [
    Query.orderDesc('postCount'),
    Query.select(['*', 'followers.follower']),
  ]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  const users = await database.listRows<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries,
  })

  return users.rows
}

export async function getInfiniteUsers(lastId?: string, limit?: number) {
  const queries = [
    Query.orderDesc('postCount'),
    Query.limit(limit || 10),
    Query.select(['*', 'followers.follower']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const users = await database.listRows<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries,
  })

  return users
}

export async function removeFollow(
  flollowId: string,
  userId: string,
  followerId: string,
) {
  await database.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    rowId: flollowId,
  })

  await database.decrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
    column: 'followersCount',
    value: 1,
  })

  await database.decrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: followerId,
    column: 'followeesCount',
    value: 1,
  })

  return null
}

export async function addFollow(userId: string, followerId: string) {
  const follow = await database.createRow<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    rowId: ID.unique(),
    data: {
      followee: userId as unknown as Users,
      follower: followerId as unknown as Users,
    },
  })

  if (!follow.$id) {
    throw new Error('Failed to follow user')
  }

  await database.incrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
    column: 'followersCount',
    value: 1,
  })

  await database.incrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: followerId,
    column: 'followeesCount',
    value: 1,
  })

  return follow
}

export async function toggleFollow(userId: string, followerId: string) {
  const existingFollow = await database.listRows<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    queries: [
      Query.equal('followee', userId),
      Query.equal('follower', followerId),
    ],
  })

  if (existingFollow.total > 0) {
    return await removeFollow(existingFollow.rows[0].$id, userId, followerId)
  } else {
    return await addFollow(userId, followerId)
  }
}
