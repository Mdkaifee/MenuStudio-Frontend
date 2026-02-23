import { useEffect, useState } from 'react'
import { fileToDataUrl } from '../utils/file'

function ItemModal({ open, mode, initialItem, categories, loading, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [price, setPrice] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }
    setName(initialItem?.name || '')
    setCategory(initialItem?.category || '')
    setDescription(initialItem?.description || '')
    setImageUrl(initialItem?.image_url || '')
    setImageName('')
    setPrice(initialItem ? String(initialItem.price) : '')
    setFormError('')
  }, [open, initialItem, mode])

  if (!open) {
    return null
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
      setFormError('')
    } catch (err) {
      setFormError(err.message)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!category) {
      setFormError('Please select a category first')
      return
    }

    const ok = await onSubmit({
      name: name.trim(),
      category,
      description: description.trim(),
      image_url: imageUrl.trim(),
      price: Number(price),
    })

    if (ok) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="modal-shell card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Update Item' : 'Add Item'}</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <form className="stack" onSubmit={submit}>
          <label>
            Item Name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} required />
          </label>

          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)} required>
              <option value="" disabled>Select category</option>
              {categories.map((entry) => (
                <option key={entry.id} value={entry.name}>{entry.name}</option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} />
          </label>

          <label>
            Image From Computer (Optional)
            <input type="file" accept="image/*" onChange={onFileChange} />
          </label>

          {imageUrl && (
            <div className="image-preview-wrap">
              <img src={imageUrl} alt="Item preview" className="item-thumb large" />
              <div className="image-preview-actions">
                <p className="muted">{imageName || 'Image selected'}</p>
                <button type="button" onClick={() => { setImageUrl(''); setImageName('') }}>Remove Image</button>
              </div>
            </div>
          )}

          <label>
            Price (₹)
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>

          {categories.length === 0 && <p className="error">Create a category first in right sidebar.</p>}
          {formError && <p className="error">{formError}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button className="primary" disabled={loading || categories.length === 0} type="submit">
              {loading ? 'Saving...' : mode === 'edit' ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ItemModal
