import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FavoriteNumber} from 'favorite-number'
import * as React from 'react'

test('renders a number input with a label "Favorite number"', () => {
  const {debug, rerender} = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
})

test('entering an invalid value shows an error message', () => {
  const {rerender} = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  userEvent.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent('The number is invalid')
  rerender(<FavoriteNumber max={10} />)
  expect(screen.queryByRole('alert')).toBeNull()
})
