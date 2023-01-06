import Link from 'next/link'
import { useRouter } from 'next/router'
import { HTMLAttributes, PropsWithChildren } from 'react'

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  href: string
}

export const NavLink: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  href,
  ...restProps
}) => {
  const router = useRouter()

  return (
    <Link href={href} legacyBehavior passHref>
      <a className={`${className} ${router.pathname === href && 'active'}`} {...restProps}>
        {children}
      </a>
    </Link>
  )
}
