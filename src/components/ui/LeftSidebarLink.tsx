import { Link, useLocation } from '@tanstack/react-router'
import type { INavLink } from '@/types'
import { cn } from '@/lib/utils'

type Props = {
  link: INavLink
}

const LeftSidebarLink = ({ link }: Props) => {
  const { pathname } = useLocation()

  const isActive = pathname === link.route

  return (
    <li
      className={cn('leftsidebar-link group', {
        'bg-primary-500': isActive,
      })}
    >
      <Link to={link.route} className="flex gap-4 items-center p-4">
        <img
          src={link.imgURL}
          alt={link.label}
          width={24}
          height={24}
          className={cn('group-hover:invert-white', {
            'invert-white': isActive,
          })}
        />
        <span>{link.label}</span>
      </Link>
    </li>
  )
}

export default LeftSidebarLink
