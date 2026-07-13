'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Moon,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Kanban,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ALL_NAV = [
  { href: '/admin',            label: 'Dashboard', icon: LayoutDashboard, exact: true,  perm: null,           adminOnly: false },
  { href: '/admin/projects',   label: 'Projects',  icon: FolderOpen,      exact: false, perm: 'tab.projects', adminOnly: false },
  { href: '/admin/crm',        label: 'CRM',       icon: Kanban,          exact: false, perm: 'tab.crm',      adminOnly: false },
  { href: '/admin/messages',   label: 'Messages',  icon: MessageSquare,   exact: false, perm: 'tab.messages', adminOnly: false },
  { href: '/admin/crm/users',  label: 'Users',      icon: UserCog,   exact: false, perm: null, adminOnly: true },
]

interface AdminShellProps {
  children: React.ReactNode
  role?: 'admin' | 'crm'
  permissions?: string[]
}

export default function AdminShell({ children, role = 'admin', permissions = [] }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = role === 'admin'
  const navItems = ALL_NAV.filter(item => {
    if (item.adminOnly) return isAdmin
    if (isAdmin) return true
    return item.perm === null || permissions.includes(item.perm)
  })

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const Sidebar = () => (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-card h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Moon className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm text-foreground">Strongmoon</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              {isAdmin ? 'Admin Panel' : 'Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive(href, exact)
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {isActive(href, exact) && <ChevronRight className="w-3 h-3 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        {isAdmin && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-1"
          >
            <Moon className="w-4 h-4" />
            View Site
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 w-56 md:hidden flex flex-col">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex md:hidden items-center gap-3 px-4 h-14 border-b border-border bg-card flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <span className="font-heading font-semibold text-sm text-foreground">Admin Panel</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
