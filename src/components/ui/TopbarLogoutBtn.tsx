import { Button } from './button'
import Loader from './Loader'
import { useLogout } from '@/lib/react-query/queriesAndMutations'

const TopbarLogoutBtn = ({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'> & {
  children?: React.ReactNode
}) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  const handleLogout = () => {
    try {
      logout('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      {...props}
      variant="ghost"
      className="shad-button_ghost cursor-pointer"
      onClick={handleLogout}
    >
      {isLoggingOut ? (
        <div className="size-6">
          <Loader />
        </div>
      ) : (
        <img src="/icons/logout.svg" alt="Logout" width={24} height={24} />
      )}
      {children}
    </Button>
  )
}

export default TopbarLogoutBtn
