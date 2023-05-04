import { NavLink } from '@/src/components/navigation/NavLink'

const Custom404 = () => {
  return (
    <>
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>
        Sorry, we couldn't find the page you were looking for. We suggest you go back to the
        Dashboard.
      </p>
      <NavLink href="/">Back to Markets</NavLink>
    </>
  )
}

export default Custom404
