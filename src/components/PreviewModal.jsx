function PreviewModal({ open, restaurantId, template, mode = 'menu', onClose }) {
  if (!open) {
    return null
  }

  const previewTemplateId = template?.id || 'classic-blue'
  const previewStyleId = template?.style_id || previewTemplateId
  const url = `${window.location.origin}/menu/${restaurantId}?preview=${previewTemplateId}`
  const hasAsset = Boolean(template?.asset_url)
  const inferredAssetType =
    template?.asset_type ||
    (template?.asset_url?.startsWith('data:application/pdf') ? 'pdf' : template?.asset_url?.startsWith('data:image/') ? 'image' : '')
  const isPdfAsset = inferredAssetType === 'pdf'
  const isImageAsset = inferredAssetType === 'image'
  const isPhotoMode = mode === 'photo'
  const isTemplateMode = mode === 'template'

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="modal-large card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{isPhotoMode ? 'Template Photo Preview' : isTemplateMode ? 'Template Preview' : 'Live Menu Preview'}</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {isTemplateMode && (
          <div className={`template-only-preview template-${previewStyleId}`}>
            <div className="public-menu book-shell">
              <h1>Template Preview</h1>
              <section className="book-page" />
            </div>
          </div>
        )}

        {isPhotoMode && hasAsset && isImageAsset && (
          <div className="template-upload-view">
            <img src={template.asset_url} alt={template.name || 'Template image'} className="template-upload-image" />
          </div>
        )}

        {isPhotoMode && hasAsset && isPdfAsset && (
          <iframe src={template.asset_url} title="Template PDF" className="preview-frame template-file-frame" />
        )}

        {isPhotoMode && !hasAsset && (
          <div className="template-upload-view">
            <p className="muted">No photo or PDF uploaded for this template.</p>
          </div>
        )}

        {!isPhotoMode && !isTemplateMode && <iframe src={url} title="Menu Preview" className="preview-frame" />}
      </section>
    </div>
  )
}

export default PreviewModal
