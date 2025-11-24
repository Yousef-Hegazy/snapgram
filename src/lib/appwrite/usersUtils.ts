import { appwriteConfig, database } from '@/appwrite/config'
import type { Users } from '@/appwrite/types/appwrite'
import { Query } from 'appwrite'

export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc('postCount')]

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

export async function getPagedUsers(lastId?: string, limit?: number) {
  const queries = [Query.orderDesc('$createdAt'), Query.limit(limit || 10)]

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
