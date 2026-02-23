function QRModal({ open, qr, restaurantId, onClose }) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="modal-shell card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Restaurant QR</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {!qr && <p className="muted">Generating QR...</p>}
        {qr && (
          <div className="qr-card">
            <p className="muted">Scan to open /menu/{restaurantId}</p>
            <img src={qr.qr_data_url} alt="Restaurant QR" className="qr-image" />
            <p className="menu-url">{qr.target_url}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default QRModal
