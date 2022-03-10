import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import {Redirect as MockedRedirect} from 'react-router'
import {savePost as mockedSavePost} from '../api'
import {Editor} from '../post-editor-02-state'

jest.mock('../api')
jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})
afterEach(() => {
  jest.clearAllMocks()
})
test('renders a form with title, content, tags, and a submit button', async () => {
  mockedSavePost.mockResolvedValueOnce()
  const fakeUser = {id: 'user-1'}
  render(<Editor user={fakeUser} />)
  const fakePost = {
    title: 'Test Title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  }
  const preDate = new Date().getTime()

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockedSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })
  expect(mockedSavePost).toHaveBeenCalledTimes(1)

  const postDate = new Date().getTime()
  const date = new Date(mockedSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)
  await waitFor(() => {
    expect(MockedRedirect).toHaveBeenCalledWith({to: '/'}, {})
  })
})

test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockedSavePost.mockRejectedValueOnce({data: {error: testError}})
  const fakeUser = {id: 'user-1'}
  render(<Editor user={fakeUser} />)

  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  const postError = await screen.findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).toBeEnabled()
})
