import { useState } from 'react'
import { fileToDataUrl } from '../utils/file'

function TemplateModal({
  open,
  mode = 'add',
  initialTemplate = null,
  loading,
  onClose,
  onSubmit,
}) {
  const isEditMode = mode === 'edit'
  const [name, setName] = useState(initialTemplate?.name || '')
  const [description, setDescription] = useState(initialTemplate?.description || '')
  const [assetUrl, setAssetUrl] = useState(initialTemplate?.asset_url || '')
  const [assetType, setAssetType] = useState(initialTemplate?.asset_type || '')
  const [assetName, setAssetName] = useState('')
  const [uploadError, setUploadError] = useState('')

  const closeModal = () => {
    if (loading) {
      return
    }
    onClose()
  }

  const inferAssetType = (type, dataUrl) => {
    if (type === 'image' || type === 'pdf') {
      return type
    }
    if (dataUrl?.startsWith('data:image/')) {
      return 'image'
    }
    if (dataUrl?.startsWith('data:application/pdf')) {
      return 'pdf'
    }
    return ''
  }

  const resolvedAssetType = inferAssetType(assetType, assetUrl)

  const onFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    let nextType = ''
    if (file.type.startsWith('image/')) {
      nextType = 'image'
    } else if (file.type === 'application/pdf') {
      nextType = 'pdf'
    } else {
      setUploadError('Only image or PDF files are allowed.')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setAssetUrl(dataUrl)
      setAssetType(nextType)
      setAssetName(file.name)
      setUploadError('')
    } catch (err) {
      setUploadError(err.message)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const ok = await onSubmit({
      name,
      description,
      asset_url: assetUrl,
      asset_type: resolvedAssetType,
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
          <h2>{isEditMode ? 'Update Template' : 'Add Template'}</h2>
          <button type="button" onClick={closeModal} disabled={loading}>Close</button>
        </div>

        <form className="stack" onSubmit={submit}>
          <label>
            Template Name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required />
          </label>
          <label>
            Description (Optional)
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200} />
          </label>
          <label>
            Template File (Image or PDF)
            <input type="file" accept="image/*,application/pdf" onChange={onFileChange} />
          </label>

          {assetUrl && (
            <div className="template-file-preview">
              {resolvedAssetType === 'image' && <img src={assetUrl} alt="Template upload preview" className="template-file-image" />}
              {resolvedAssetType === 'pdf' && (
                <div className="template-file-pdf">
                  <p className="muted">{assetName || 'PDF file selected'}</p>
                  <a href={assetUrl} target="_blank" rel="noreferrer">Open PDF</a>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setAssetUrl('')
                  setAssetType('')
                  setAssetName('')
                }}
              >
                Remove File
              </button>
            </div>
          )}

          {uploadError && <p className="error">{uploadError}</p>}

          <div className="modal-actions">
            <button type="button" onClick={closeModal} disabled={loading}>Cancel</button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Template' : 'Add Template'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TemplateModal
