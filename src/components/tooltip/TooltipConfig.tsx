import { Tooltip } from 'react-tooltip'

const TooltipConfig: React.FC = () => {
  return (
    <Tooltip
      className="customTooltip"
      delayHide={250}
      delayShow={0}
      id="mainTooltip"
      positionStrategy="absolute"
    />
  )
}

export default TooltipConfig
