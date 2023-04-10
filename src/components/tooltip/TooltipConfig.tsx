import { Tooltip } from 'react-tooltip'

const TooltipConfig: React.FC = ({ ...restProps }) => {
  return (
    <Tooltip
      className="customTooltip"
      clickable
      delayHide={250}
      delayShow={0}
      id="mainTooltip"
      positionStrategy="absolute"
      {...restProps}
    />
  )
}

export default TooltipConfig
