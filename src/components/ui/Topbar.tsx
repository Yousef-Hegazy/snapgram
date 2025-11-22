import { useAuthContext } from '@/context/AuthContext'
import { Link } from '@tanstack/react-router'
import TopbarLogoutBtn from './TopbarLogoutBtn'

const Topbar = () => {
  const { user } = useAuthContext()

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/images/logo.svg"
            alt="Snapgram Logo"
            width={130}
            height={130}
          />
        </Link>

        <div className="flex gap-4">
          <TopbarLogoutBtn />

          <Link
            to="/profile/$id"
            params={{ id: user.id }}
            className="flex-center gap-3"
          >
            <img
              src={user.imageUrl || '/images/profile-placeholder.svg'}
              alt="profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar
