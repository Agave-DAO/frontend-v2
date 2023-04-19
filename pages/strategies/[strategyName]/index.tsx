import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Strategy: NextPage = () => {
  const router = useRouter()

  const { strategyName } = router.query

  return <>Strategy name: {strategyName}</>
}

export default Strategy
