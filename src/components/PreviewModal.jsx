function PreviewModal({ open, restaurantId, template, onClose }) {
  if (!open) {
    return null
  }

  const previewTemplateId = template?.id || 'classic-blue'
  const url = `${window.location.origin}/menu/${restaurantId}?preview=${previewTemplateId}`
  const hasAsset = Boolean(template?.asset_url)
  const inferredAssetType =
    template?.asset_type ||
    (template?.asset_url?.startsWith('data:application/pdf') ? 'pdf' : template?.asset_url?.startsWith('data:image/') ? 'image' : '')
  const isPdfAsset = inferredAssetType === 'pdf'
  const isImageAsset = inferredAssetType === 'image'

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="modal-large card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Live Menu Template Preview</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {hasAsset && isImageAsset && (
          <div className="template-upload-view">
            <img src={template.asset_url} alt={template.name || 'Template image'} className="template-upload-image" />
          </div>
        )}

        {hasAsset && isPdfAsset && (
          <iframe src={template.asset_url} title="Template PDF" className="preview-frame" />
        )}

        {!hasAsset && <iframe src={url} title="Menu Preview" className="preview-frame" />}
      </section>
    </div>
  )
}

export default PreviewModal
