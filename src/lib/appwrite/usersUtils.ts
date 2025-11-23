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
