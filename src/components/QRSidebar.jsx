function QRSidebar({ qr, restaurantId, onDownloadMenu }) {
  const downloadQr = () => {
    if (!qr?.qr_data_url) {
      return
    }
    const link = document.createElement('a')
    link.href = qr.qr_data_url
    link.download = `restaurant-${restaurantId}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openMenu = () => {
    if (!qr?.target_url) {
      return
    }
    window.open(qr.target_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <aside className="qr-sidebar card">
      <h3>QR Sidebar</h3>
      {!qr && <p className="muted">Generating QR...</p>}
      {qr && (
        <>
          <img src={qr.qr_data_url} alt="Restaurant QR" className="qr-image" />
          <p className="menu-url">{qr.target_url}</p>
          <div className="stack">
            <button type="button" onClick={openMenu}>Open Full Menu</button>
            <button type="button" onClick={downloadQr}>Download QR</button>
            <button type="button" className="primary" onClick={onDownloadMenu}>Download Menu</button>
          </div>
        </>
      )}
    </aside>
  )
}

export default QRSidebar
