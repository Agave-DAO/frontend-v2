import React from 'react'
import styled from 'styled-components'

import { Notifications as NotificationsIcon } from '@/src/components/assets/Notifications'
import { DropdownPosition } from '@/src/components/common/Dropdown'
import { Dropdown } from '@/src/components/header/Helpers'

const Wrapper = styled(Dropdown)`
  --horizontal-padding: 10px;

  .dropdownButton {
    padding: 0;
  }

  .dropdownItems {
    width: 215px;
  }
`

const NotificationsButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  height: 100%;
  position: relative;
`

const Badge = styled.div`
  --ball-dimensions: 10px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.success};
  border-radius: 50%;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 0.7rem;
  font-weight: 700;
  height: var(--ball-dimensions);
  justify-content: center;
  left: -3px;
  line-height: 1;
  position: absolute;
  top: 50%;
  width: var(--ball-dimensions);
  z-index: 5;
`

const DropdownHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.2rem;
  font-weight: 700;
  height: 30px;
  line-height: 1.2;
  padding: 0 var(--horizontal-padding);
`

const Notifications = styled.div`
  height: 140px;
  overflow: auto;
`

const Notification = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.1rem;
  line-height: 1.4;
  padding: 8px var(--horizontal-padding);

  &:nth-child(odd) {
    background-color: rgba(128, 128, 128, 0.08);
  }
`

const Highlight = styled.span`
  color: ${({ theme: { colors } }) => colors.primaryDark};
  cursor: pointer;
  text-decoration: underline;
  white-space: normal;

  &:hover {
    text-decoration: none;
  }
`

const NotificatonsButton: React.FC<{ notifications?: number }> = ({
  notifications,
  ...restProps
}) => (
  <NotificationsButton {...restProps}>
    {notifications && <Badge>{notifications}</Badge>}
    <NotificationsIcon />
  </NotificationsButton>
)

const mocked_notifications = [
  { asset: 'Temp NFT #18923', type: 'expired' },
  { asset: 'Signature 0x92345...8992', type: 'rented' },
  { asset: 'Dirty Monkey NFT #8993', type: 'bought' },
  { asset: 'Crazy Banana NFT #9920', type: 'expired' },
]

export const NotificationsDropdown: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper
      dropdownButton={<NotificatonsButton notifications={mocked_notifications.length} />}
      dropdownPosition={DropdownPosition.right}
      items={[
        <React.Fragment key="0">
          <DropdownHeader>Notifications</DropdownHeader>
          <Notifications>
            {mocked_notifications.map(({ asset, type }, index) => (
              <Notification key={index}>
                {type === 'expired' && (
                  <>
                    Your rental <Highlight>{asset}</Highlight> expired
                  </>
                )}
                {type === 'rented' && (
                  <>
                    Someone rented <Highlight>{asset}</Highlight>
                  </>
                )}
                {type === 'bought' && (
                  <>
                    Someone bought <Highlight>{asset}</Highlight>
                  </>
                )}
              </Notification>
            ))}
          </Notifications>
        </React.Fragment>,
      ]}
      {...restProps}
    />
  )
}
