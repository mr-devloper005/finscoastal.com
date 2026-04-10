'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export function AuthActionLink({
  createHref = '/create/classified',
  loginHref = '/login?next=%2Fcreate%2Fclassified',
  className,
  children,
  onClick,
}: {
  createHref?: string
  loginHref?: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const { isAuthenticated } = useAuth()

  return (
    <Link href={isAuthenticated ? createHref : loginHref} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
