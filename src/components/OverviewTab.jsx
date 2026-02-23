function OverviewTab({ items, categories }) {
  const avgItemsPerCategory = categories.length ? (items.length / categories.length).toFixed(1) : '0.0'

  return (
    <section className="tab-panel">
      <section className="card dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Dashboard</p>
          <h2>Menu Snapshot</h2>
          <p className="muted">Track your catalog at a glance and manage data in sheet-style tabs.</p>
        </div>
        <div className="stats-grid dashboard-stats-grid">
          <article className="stat-card">
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </article>
          <article className="stat-card">
            <span>Total Items</span>
            <strong>{items.length}</strong>
          </article>
          <article className="stat-card">
            <span>Items / Category</span>
            <strong>{avgItemsPerCategory}</strong>
          </article>
        </div>
      </section>
    </section>
  )
}

export default OverviewTab
