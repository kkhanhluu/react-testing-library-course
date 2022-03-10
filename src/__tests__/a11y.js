import {render} from '@testing-library/react'
import {axe} from 'jest-axe'
import * as React from 'react'

function InaccessibleForm() {
  return (
    <form>
      <input placeholder="email" />
    </form>
  )
}

function AccessibleForm() {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" placeholder="username" />
    </form>
  )
}

test('the form is accessible', async () => {
  const {debug, container} = render(<InaccessibleForm />)
  debug()
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
