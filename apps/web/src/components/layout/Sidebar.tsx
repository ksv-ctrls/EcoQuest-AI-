import { Leaf, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { mainNavItems, secondaryNavItems } from '@/data/navigation'
import { cn } from '@/lib/cn'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function NavSection({
  items,
  onNavigate,
}: {
  items: typeof mainNavItems
  onNavigate?: () => void
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon

        if (!item.enabled) {
          return (
            <li key={item.path}>
              <span
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sage/60"
                title={item.description}
              >
                <Icon className="size-5 shrink-0" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className="rounded bg-cream/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                  Soon
                </span>
              </span>
            </li>
          )
        }

        return (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={
                item.path !== '/sdg' &&
                item.path !== '/lessons' &&
                item.path !== '/quizzes' &&
                item.path !== '/missions'
              }
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-l-2 border-gold bg-primary-green/20 text-cream'
                    : 'text-sage hover:bg-cream/5 hover:text-cream',
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-cream/10 px-5 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary-green">
          <Leaf className="size-5 text-cream" />
        </div>
        <div>
          <p className="font-display text-lg font-bold leading-tight text-cream">
            EcoQuest AI
          </p>
          <p className="text-xs text-sage">Learn the SDGs</p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-lg p-1 text-sage hover:bg-cream/10 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <NavSection items={mainNavItems} onNavigate={onMobileClose} />
        <div className="my-4 border-t border-cream/10" />
        <NavSection items={secondaryNavItems} onNavigate={onMobileClose} />
      </nav>

      <div className="border-t border-cream/10 px-5 py-4">
        <p className="text-xs leading-relaxed text-sage">
          Milestone 1 preview — mock data only
        </p>
      </div>
    </div>
  )

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary-dark/60 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-cream/10 bg-primary-dark transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {content}
      </aside>
    </>
  )
}

export function SidebarMobileToggle({
  onOpen,
}: {
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      className="rounded-lg p-2 text-cream hover:bg-cream/10 lg:hidden"
      onClick={onOpen}
      aria-label="Open menu"
    >
      <Menu className="size-5" />
    </button>
  )
}
