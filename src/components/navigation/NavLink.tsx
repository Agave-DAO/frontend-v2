import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

interface Props extends LinkProps {
  className?: string
}

export const NavLink: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  href,
  scroll = true,
  shallow = false,
  ...restProps
}) => {
  const router = useRouter()

  return (
    <Link href={href} legacyBehavior passHref scroll={scroll} shallow={shallow}>
      <a
        className={`${className || ''} ${router.pathname === href ? 'active' : ''}`}
        {...restProps}
      >
        {children}
      </a>
    </Link>
  )
}
