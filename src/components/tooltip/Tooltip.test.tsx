import React from 'react'

import { Tooltip } from './Tooltip'

const maliciousText = '<img src=x onerror=alert(1)>'

it('keeps string content out of the HTML tooltip sink', () => {
  const tooltip = Tooltip({ content: maliciousText })

  expect(tooltip.props['data-tooltip-content']).toBe(maliciousText)
  expect(tooltip.props['data-tooltip-html']).toBeUndefined()
})

it('preserves React formatting while escaping embedded text', () => {
  const tooltip = Tooltip({ content: <strong>{maliciousText}</strong> })

  expect(tooltip.props['data-tooltip-content']).toBeUndefined()
  expect(tooltip.props['data-tooltip-html']).toBe(
    '<strong>&lt;img src=x onerror=alert(1)&gt;</strong>',
  )
})
