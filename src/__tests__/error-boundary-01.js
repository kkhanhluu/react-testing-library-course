import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('💣')
  } else {
    return null
  }
}

test('calls reportError and renders that there was a problem', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  const {rerender} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )
  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )
  mockReportError.mockClear()
  console.error.mockClear()

  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )
  userEvent.click(screen.getByText(/try again/i))
  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
})

afterEach(() => {
  jest.clearAllMocks()
})

// test('calls reportError and renders that there was a problem', () => {
//   mockReportError.mockResolvedValueOnce({success: true})
//   const {rerender} = render(
//     <ErrorBoundary>
//       <Bomb />
//     </ErrorBoundary>,
//   )

//   rerender(
//     <ErrorBoundary>
//       <Bomb shouldThrow={true} />
//     </ErrorBoundary>,
//   )

//   const error = expect.any(Error)
//   const info = {componentStack: expect.stringContaining('Bomb')}
//   expect(mockReportError).toHaveBeenCalledWith(error, info)
//   expect(mockReportError).toHaveBeenCalledTimes(1)
// })

// this is only here to make the error output not appear in the project's output
// even though in the course we don't include this bit and leave it in it's incomplete state.
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {})
// })

// afterEach(() => {
//   console.error.mockRestore()
// })

/*
eslint
  jest/prefer-hooks-on-top: off
*/
