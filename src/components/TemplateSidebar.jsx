import { useMemo, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import TemplateModal from './TemplateModal'

function TemplateSidebar({
  templates,
  selectedTemplateId,
  savingTemplate,
  creatingTemplate,
  onTemplateChange,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onViewTemplate,
}) {
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add',
    template: null,
    key: 0,
  })
  const [confirmDeleteTemplate, setConfirmDeleteTemplate] = useState(null)
  const builtinTemplates = useMemo(() => templates.filter((tpl) => !tpl.is_custom), [templates])
  const customTemplates = useMemo(() => templates.filter((tpl) => tpl.is_custom), [templates])

  const openAddModal = () => {
    setModalState((prev) => ({ open: true, mode: 'add', template: null, key: prev.key + 1 }))
  }

  const openEditModal = (template) => {
    setModalState((prev) => ({ open: true, mode: 'edit', template, key: prev.key + 1 }))
  }

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }))
  }

  const submitTemplate = async (payload) => {
    if (modalState.mode === 'edit' && modalState.template?.id) {
      return onUpdateTemplate(modalState.template.id, payload)
    }
    return onCreateTemplate(payload)
  }

  const deleteTemplate = (template) => {
    setConfirmDeleteTemplate(template)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteTemplate) {
      return
    }
    await onDeleteTemplate(confirmDeleteTemplate)
    setConfirmDeleteTemplate(null)
  }

  const renderBuiltinTemplateRow = (tpl, index) => (
    <tr key={tpl.id}>
      <td>{index + 1}</td>
      <td className="sheet-primary">{tpl.name}</td>
      <td>{tpl.description || (tpl.is_custom ? 'Custom template' : 'Built-in template')}</td>
      <td>{tpl.asset_type ? (tpl.asset_type === 'pdf' ? 'PDF' : 'Image') : '—'}</td>
      <td>{selectedTemplateId === tpl.id ? 'Active' : 'Inactive'}</td>
      <td>
        <div className="sheet-inline-actions">
          <button
            type="button"
            onClick={() => onTemplateChange(tpl.id)}
            disabled={savingTemplate || selectedTemplateId === tpl.id}
          >
            {selectedTemplateId === tpl.id ? 'Active' : 'Use'}
          </button>
          <button type="button" onClick={() => onViewTemplate(tpl.id, 'template')} disabled={savingTemplate}>
            View Template
          </button>
          <button
            type="button"
            onClick={() => onViewTemplate(tpl.id, 'menu')}
            disabled={savingTemplate || selectedTemplateId !== tpl.id}
          >
            View Menu
          </button>
        </div>
      </td>
    </tr>
  )

  const renderCustomTemplateRow = (tpl, index) => (
    <tr key={tpl.id}>
      <td>{index + 1}</td>
      <td className="sheet-primary">{tpl.name}</td>
      <td>{tpl.description || 'Custom template'}</td>
      <td>{tpl.asset_type ? (tpl.asset_type === 'pdf' ? 'PDF' : 'Image') : '—'}</td>
      <td>{selectedTemplateId === tpl.id ? 'Active' : 'Inactive'}</td>
      <td>
        <div className="sheet-inline-actions">
          <button
            type="button"
            onClick={() => onTemplateChange(tpl.id)}
            disabled={savingTemplate || selectedTemplateId === tpl.id}
          >
            {selectedTemplateId === tpl.id ? 'Active' : 'Use'}
          </button>
          <button type="button" onClick={() => onViewTemplate(tpl.id, 'photo')} disabled={savingTemplate}>View Photo</button>
          <button
            type="button"
            onClick={() => onViewTemplate(tpl.id, 'menu')}
            disabled={savingTemplate || selectedTemplateId !== tpl.id}
          >
            View Menu
          </button>
        </div>
      </td>
      <td className="sheet-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label="Edit template"
          title="Edit template"
          onClick={() => openEditModal(tpl)}
          disabled={savingTemplate}
        >
          <img src="/edit.png" alt="" aria-hidden="true" className="action-icon" />
        </button>
        <button
          type="button"
          className="icon-btn danger-icon"
          aria-label="Delete template"
          title="Delete template"
          onClick={() => deleteTemplate(tpl)}
          disabled={savingTemplate}
        >
          <img src="/delete.png" alt="" aria-hidden="true" className="action-icon" />
        </button>
      </td>
    </tr>
  )

  return (
    <section className="template-sidebar card">
      <div className="section-toolbar">
        <div>
          <h2>Templates</h2>
          <p className="muted">Choose active theme and preview in modal.</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="primary" onClick={openAddModal}>Add Template</button>
          <button
            type="button"
            onClick={() => onViewTemplate(selectedTemplateId, 'menu')}
            disabled={!selectedTemplateId || savingTemplate}
          >
            View Menu
          </button>
        </div>
      </div>

      <div className="template-list">
        <section className="template-group">
          <h3>Existing Templates</h3>
          <div className="sheet-table-wrap">
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Select / View</th>
                </tr>
              </thead>
              <tbody>{builtinTemplates.map(renderBuiltinTemplateRow)}</tbody>
            </table>
          </div>
        </section>
        <section className="template-group">
          <h3>Added by User</h3>
          <div className="sheet-table-wrap">
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Select / View</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customTemplates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="sheet-empty">No custom templates yet.</td>
                  </tr>
                )}
                {customTemplates.map(renderCustomTemplateRow)}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <TemplateModal
        key={modalState.key}
        open={modalState.open}
        mode={modalState.mode}
        initialTemplate={modalState.template}
        loading={savingTemplate || creatingTemplate}
        onClose={closeModal}
        onSubmit={submitTemplate}
      />

      <ConfirmModal
        open={Boolean(confirmDeleteTemplate)}
        title="Delete Template"
        message={confirmDeleteTemplate ? `Delete "${confirmDeleteTemplate.name}" template?` : ''}
        confirmLabel="Delete Template"
        loading={savingTemplate}
        onCancel={() => setConfirmDeleteTemplate(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

export default TemplateSidebar
