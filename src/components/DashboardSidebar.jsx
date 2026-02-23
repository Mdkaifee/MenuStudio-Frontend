function DashboardSidebar({ user, activeTab, onChange, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'menu', label: 'Menu' },
    { id: 'categories', label: 'Categories' },
    { id: 'items', label: 'Items' },
  ]

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <span>MENU</span>
        <strong>Admin Panel</strong>
      </div>

      <div className="sidebar-head">
        <p className="eyebrow">Restaurant Dashboard</p>
        <h2>{user.restaurant_name}</h2>
        <p className="muted">/menu/{user.id}</p>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={onLogout}>Log out</button>
    </aside>
  )
}

export default DashboardSidebar
