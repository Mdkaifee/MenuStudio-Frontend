import { useState } from 'react'
import { fileToDataUrl } from '../utils/file'

function CategoryModal({ open, mode = 'add', initialCategory = null, loading, onClose, onSubmit }) {
  const isEditMode = mode === 'edit'
  const [name, setName] = useState(initialCategory?.name || '')
  const [description, setDescription] = useState(initialCategory?.description || '')
  const [imageUrl, setImageUrl] = useState(initialCategory?.image_url || '')
  const [imageName, setImageName] = useState('')
  const [error, setError] = useState('')

  const closeModal = () => {
    if (loading) {
      return
    }
    onClose()
  }

  const onFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    try {
      const dataUrl = await fileToDataUrl(file)
      setImageUrl(dataUrl)
      setImageName(file.name)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const ok = await onSubmit({
      name,
      description,
      image_url: imageUrl,
    })
    if (ok) {
      onClose()
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={closeModal} role="presentation">
      <section className="modal-shell card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Update Category' : 'Add Category'}</h2>
          <button type="button" onClick={closeModal} disabled={loading}>Close</button>
        </div>

        <form className="stack" onSubmit={submit}>
          <label>
            Category Name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
          </label>

          <label>
            Description (Optional)
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={220} />
          </label>

          <label>
            Category Image (Optional)
            <input type="file" accept="image/*" onChange={onFileChange} />
          </label>

          {imageUrl && (
            <div className="image-preview-wrap">
              <img src={imageUrl} alt="Category preview" className="item-thumb large" />
              <div className="image-preview-actions">
                <p className="muted">{imageName || 'Image selected'}</p>
                <button type="button" onClick={() => { setImageUrl(''); setImageName('') }}>Remove Image</button>
              </div>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={closeModal} disabled={loading}>Cancel</button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CategoryModal
