import * as React from 'react'
import {Redirect} from 'react-router'
import {savePost} from './api'

function Editor({user}) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [redirect, setRedirect] = React.useState(false)
  const [error, setError] = React.useState()
  function handleSubmit(e) {
    const {title, content, tags} = e.target.elements
    e.preventDefault()
    setIsSaving(true)
    savePost({
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
      date: new Date().toISOString(),
      authorId: user.id,
    })
      .then(() => setRedirect(true))
      .catch((err) => setError(err.data.error))
      .finally(() => setIsSaving(false))
  }

  if (redirect) {
    return <Redirect to="/" />
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
      {error ? <div role="alert">{error}</div> : null}
    </form>
  )
}

export {Editor}
