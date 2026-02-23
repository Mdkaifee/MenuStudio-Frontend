function ConfirmModal({
  open,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  const close = () => {
    if (loading) {
      return
    }
    onCancel()
  }

  return (
    <div className="modal-backdrop" onClick={close} role="presentation">
      <section className="modal-shell card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <p className="confirm-message">{message}</p>

        <div className="modal-actions">
          <button type="button" onClick={close} disabled={loading}>{cancelLabel}</button>
          <button type="button" className="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
