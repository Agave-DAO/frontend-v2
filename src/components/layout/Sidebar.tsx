import { useState } from 'react'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Checkbox } from '@/src/components/form/Checkbox'
import { Radiobutton } from '@/src/components/form/Radiobutton'
import { Textfield } from '@/src/components/form/Textfield'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin: 0 0 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Sidebar: React.FC = ({ ...restProps }) => {
  const [radioButton, setRadioButton] = useState<'one' | 'two' | 'three' | undefined>()

  return (
    <Wrapper {...restProps}>
      <Row>
        <BaseParagraph>Add something here:</BaseParagraph>
        <Textfield placeholder="Come on..." />
      </Row>
      <Row>
        <BaseParagraph>Radio Buttons!</BaseParagraph>
        <Radiobutton checked={radioButton === 'one'} onClick={() => setRadioButton('one')}>
          One
        </Radiobutton>
        <Radiobutton checked={radioButton === 'two'} onClick={() => setRadioButton('two')}>
          Two
        </Radiobutton>
        <Radiobutton checked={radioButton === 'three'} onClick={() => setRadioButton('three')}>
          Three
        </Radiobutton>
      </Row>
      <Row>
        <BaseParagraph>Checkboxes!</BaseParagraph>
        <Checkbox
          checked={true}
          onClick={(isCheckboxOneChecked) => console.log({ isCheckboxOneChecked })}
        >
          One
        </Checkbox>
        <Checkbox disabled>Two</Checkbox>
        <Checkbox>Three</Checkbox>
      </Row>
    </Wrapper>
  )
}
