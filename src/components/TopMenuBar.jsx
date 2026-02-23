function TopMenuBar({ templates, user, savingTemplate, onTemplateChange, onOpenItems, onOpenStudio }) {
  return (
    <section className="card top-menu-bar">
      <div className="top-menu-group">
        <label>
          Menu Template
          <select value={user.template_id} onChange={(event) => onTemplateChange(event.target.value)} disabled={savingTemplate}>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="top-menu-actions">
        <button type="button" onClick={onOpenItems}>Categories & Items</button>
        <button type="button" className="primary" onClick={onOpenStudio}>Template & QR Menu</button>
      </div>
    </section>
  )
}

export default TopMenuBar
