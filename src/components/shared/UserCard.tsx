import type { Users } from '@/appwrite/types/appwrite'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

type Props = {
  user: Users
  currentUserId?: string
}

const UserCard = ({ user, currentUserId }: Props) => {
  const isCurrentUser = user.$id === currentUserId;
  
  return (
    <Link to="/profile/$id" params={{ id: user.$id }} className="user-card">
      <img
        src={user.imageUrl}
        alt={user.name}
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>

        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button
        onClick={
          !isCurrentUser
            ? (e) => {
                e.stopPropagation()
                e.preventDefault()
              }
            : undefined
        }
        type="button"
        size="sm"
        className={cn('shad-button_primary px-5', {
          'opacity-0 pointer-events-none': isCurrentUser,
        })}
      >
        Follow
      </Button>
    </Link>
  )
}

export default UserCard
