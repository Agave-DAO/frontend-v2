import { Spinner } from '@/src/components/loading/Spinner'
import { Column } from '@/src/pagePartials/markets/stepper/components/Column'
import { Step } from '@/src/pagePartials/markets/stepper/types'

export interface StepCardProps {
  title: string
  index: number
  status: Step['status']
  done?: React.ReactNode
}

export function StepCard({ done, index, status, title }: StepCardProps) {
  return (
    <Column
      style={{
        gap: '1px',
        height: '120px',
        outline: `3px solid ${status === 'idle' ? 'gray' : 'green'}`,
        width: '60px',
      }}
    >
      <div>{index}</div>
      <p>{title}</p>
      {status === 'processing' && <Spinner />}
      {status === 'completed' && done}
    </Column>
  )
}
