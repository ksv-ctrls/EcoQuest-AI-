import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Compass,
  Gamepad2,
  LayoutDashboard,
  Sparkles,
  Target,
  User,
  Award,
  Bot,
  Activity,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  enabled: boolean
  description?: string
}

export const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    label: 'SDG Explorer',
    path: '/sdg',
    icon: Compass,
    enabled: true,
  },
  {
    label: 'Lessons',
    path: '/lessons',
    icon: BookOpen,
    enabled: true,
  },
  {
    label: 'Quizzes',
    path: '/quizzes',
    icon: Sparkles,
    enabled: true,
  },
  {
    label: 'Missions',
    path: '/missions',
    icon: Target,
    enabled: true,
  },
  {
    label: 'Games',
    path: '/games',
    icon: Gamepad2,
    enabled: true,
  },
  {
    label: 'AI Tutor',
    path: '/ai-tutor',
    icon: Bot,
    enabled: true,
  },
  {
    label: 'Impact',
    path: '/impact',
    icon: Activity,
    enabled: true,
  },
]

export const secondaryNavItems: NavItem[] = [
  {
    label: 'Profile',
    path: '/profile',
    icon: User,
    enabled: true,
    description: 'Your Eco Profile',
  },
  {
    label: 'Achievements',
    path: '/achievements',
    icon: Sparkles,
    enabled: true,
    description: 'Track your unlocked achievements',
  },
  {
    label: 'Rewards',
    path: '/rewards',
    icon: Award,
    enabled: true,
    description: 'Spend EcoCoins on rewards',
  },
]

export interface RouteMeta {
  title: string
  subtitle?: string
}

export const routeMeta: Record<string, RouteMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Track your environmental learning journey',
  },
  '/sdg': {
    title: 'SDG Explorer',
    subtitle: 'Explore all 17 Sustainable Development Goals',
  },
  '/lessons': {
    title: 'Lessons',
    subtitle: 'Interactive SDG learning modules',
  },
  '/quizzes': {
    title: 'Quizzes',
    subtitle: 'Test your sustainability knowledge',
  },
  '/missions': {
    title: 'Missions',
    subtitle: 'Real-world environmental impact actions',
  },
  '/games': {
    title: 'Games',
    subtitle: 'Learn through eco mini-games',
  },
  '/ai-tutor': {
    title: 'AI Eco Mentor',
    subtitle: 'Your EcoQuest learning companion',
  },
  '/impact': {
    title: 'Impact Analytics',
    subtitle: 'Track sustainability outcomes and SDG mastery',
  },
  '/impact/report': {
    title: 'Weekly Report',
    subtitle: 'Your sustainability activity summary',
  },
  '/tutor': {
    title: 'AI Eco Mentor',
    subtitle: 'Your EcoQuest learning companion',
  },
  '/onboarding': {
    title: 'Onboarding',
    subtitle: 'Set up your personalized Eco Profile',
  },
  '/profile': {
    title: 'Profile',
    subtitle: 'Your achievements and settings',
  },
  '/achievements': {
    title: 'Achievements',
    subtitle: 'Your milestones and unlocked rewards',
  },
  '/rewards': {
    title: 'Rewards',
    subtitle: 'Spend EcoCoins on avatars, themes, and titles',
  },
}

export function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith('/sdg/')) {
    return routeMeta['/sdg']!
  }
  if (pathname.startsWith('/lessons/') && pathname.split('/').length > 3) {
    return {
      title: 'Lesson',
      subtitle: 'Interactive SDG learning module',
    }
  }
  if (pathname.startsWith('/lessons/')) {
    return {
      title: 'SDG Lessons',
      subtitle: 'Lessons for this Sustainable Development Goal',
    }
  }
  if (pathname.startsWith('/quizzes/') && pathname.split('/').length > 3) {
    return {
      title: 'Quiz Session',
      subtitle: 'Test your SDG knowledge',
    }
  }
  if (pathname.startsWith('/quizzes/')) {
    return {
      title: 'SDG Quizzes',
      subtitle: 'Quizzes for this Sustainable Development Goal',
    }
  }
  if (pathname.startsWith('/missions/') && pathname.split('/').length > 3) {
    return {
      title: 'Mission',
      subtitle: 'Real-world environmental action',
    }
  }
  if (pathname.startsWith('/missions/')) {
    return {
      title: 'SDG Missions',
      subtitle: 'Missions for this Sustainable Development Goal',
    }
  }
  return routeMeta[pathname] ?? { title: 'EcoQuest AI' }
}
