import { NextPage } from 'next'
import Link from 'next/link'

import { GenericError } from '@/src/components/common/GenericError'

const Error404: NextPage = () => {
  return (
    <GenericError
      text={
        <>
          Sorry, but the page you're looking for doesn't seem to exist. It may have been moved or
          deleted.
          <br />
          <br />
          Please double-check the URL for any typos or try navigating to the content you were
          looking for from <Link href="/">the homepage</Link>.
        </>
      }
      title="Error 404"
    />
  )
}

export default Error404
