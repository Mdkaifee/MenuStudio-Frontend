import OverviewTab from './OverviewTab'

function DashboardQrTab({ items, categories, qr, onOpenQrModal, onShareQr, onShareMenu, onOpenQrInNewTab }) {
  return (
    <section className="dashboard-qr-layout">
      <OverviewTab items={items} categories={categories} />
      <aside className="card qr-actions-card">
        <div className="qr-actions-top">
          <h3>QR & Menu</h3>
          <p className="muted">Open and share your customer menu QR instantly.</p>
        </div>
        <div className="stack qr-actions-stack">
          <button type="button" className="primary" onClick={onOpenQrModal} disabled={!qr}>View QR</button>
          <div className="qr-share-actions">
            <button type="button" onClick={onShareQr} disabled={!qr}>Share QR</button>
            <button type="button" onClick={onShareMenu}>Share Menu</button>
            <button type="button" onClick={onOpenQrInNewTab}>Open QR in New Tab</button>
          </div>
          <p className="muted">Any item or category update reflects automatically in menu view.</p>
        </div>
      </aside>
    </section>
  )
}

export default DashboardQrTab
