import { LogOut, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { SidebarMobileToggle } from '@/components/layout/Sidebar'
import { mockUser } from '@/data/mock/user'
import { getRouteMeta } from '@/data/navigation'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/AuthContext'

interface NavbarProps {
  pathname: string
  onMenuOpen: () => void
}

export function Navbar({ pathname, onMenuOpen }: NavbarProps) {
  const meta = getRouteMeta(pathname)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cream/10 bg-primary-dark/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <SidebarMobileToggle onOpen={onMenuOpen} />

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-semibold text-cream">
            {meta.title}
          </h1>
          {meta.subtitle ? (
            <p className="truncate text-sm text-sage">{meta.subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'hidden items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 sm:flex',
            )}
          >
            <Sparkles className="size-4 text-gold" />
            <span className="text-sm font-semibold text-cream">
              {user?.ecoCoins?.toLocaleString() || mockUser.ecoPoints.toLocaleString()}
            </span>
            <span className="text-xs text-sage">eco-pts</span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar initials={user?.name?.split(' ').map(n => n[0]).join('') || mockUser.initials} />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-cream">{user?.name || mockUser.displayName}</p>
              <p className="text-xs text-sage">Level {user?.level || mockUser.level}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg p-2 text-sage hover:bg-cream/10 hover:text-cream"
              title="Logout"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
