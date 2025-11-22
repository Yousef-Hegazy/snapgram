import { Link, useLocation } from '@tanstack/react-router'
import type { INavLink } from '@/types'
import { cn } from '@/lib/utils'

type Props = {
  link: INavLink
}

const BottombarLink = ({ link }: Props) => {
  const { pathname } = useLocation()

  const isActive = pathname === link.route

  return (
    <Link
      to={link.route}
      className={cn(
        'rounded-[10px] group flex-center flex-col gap-2 p-4 transition',
        {
          'bg-primary-500': isActive,
        },
      )}
    >
      <img
        src={link.imgURL}
        alt={link.label}
        width={16}
        height={16}
        className={cn({
          'invert-white': isActive,
        })}
      />
      <p className="tiny-medium text-light-2">{link.label}</p>
    </Link>
  )
}

export default BottombarLink
