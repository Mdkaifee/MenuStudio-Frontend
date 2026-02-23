import { useState } from 'react'
import CategoryModal from './CategoryModal'
import ConfirmModal from './ConfirmModal'

function CategorySidebar({ categories, onAddCategory, onUpdateCategory, onDeleteCategory, loading }) {
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add',
    category: null,
    key: 0,
  })
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null)

  const openAddModal = () => {
    setModalState((prev) => ({ open: true, mode: 'add', category: null, key: prev.key + 1 }))
  }

  const openEditModal = (category) => {
    setModalState((prev) => ({ open: true, mode: 'edit', category, key: prev.key + 1 }))
  }

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }))
  }

  const submitCategory = async (payload) => {
    if (modalState.mode === 'edit' && modalState.category?.id) {
      return onUpdateCategory(modalState.category.id, payload)
    }
    return onAddCategory(payload)
  }

  const deleteCategory = (category) => {
    setConfirmDeleteCategory(category)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteCategory) {
      return
    }
    await onDeleteCategory(confirmDeleteCategory)
    setConfirmDeleteCategory(null)
  }

  return (
    <section className="category-sidebar card">
      <div className="section-toolbar">
        <div>
          <h2>Categories</h2>
          <p className="muted">Manage category list and cover images.</p>
        </div>
        <button type="button" className="primary" onClick={openAddModal}>Add Category</button>
      </div>

      <div className="sheet-table-wrap">
        <table className="sheet-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="sheet-empty">No categories yet.</td>
              </tr>
            )}
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td className="sheet-primary">{category.name}</td>
                <td>{category.description || '—'}</td>
                <td>
                  {category.image_url ? <img src={category.image_url} alt={category.name} className="sheet-thumb" /> : '—'}
                </td>
                <td className="sheet-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Edit category"
                    title="Edit category"
                    onClick={() => openEditModal(category)}
                    disabled={loading}
                  >
                    <img src="/edit.png" alt="" aria-hidden="true" className="action-icon" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger-icon"
                    aria-label="Delete category"
                    title="Delete category"
                    onClick={() => deleteCategory(category)}
                    disabled={loading}
                  >
                    <img src="/delete.png" alt="" aria-hidden="true" className="action-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryModal
        key={modalState.key}
        open={modalState.open}
        mode={modalState.mode}
        initialCategory={modalState.category}
        loading={loading}
        onClose={closeModal}
        onSubmit={submitCategory}
      />

      <ConfirmModal
        open={Boolean(confirmDeleteCategory)}
        title="Delete Category"
        message={
          confirmDeleteCategory
            ? `Delete "${confirmDeleteCategory.name}"? Items in this category will also be deleted.`
            : ''
        }
        confirmLabel="Delete Category"
        loading={loading}
        onCancel={() => setConfirmDeleteCategory(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

export default CategorySidebar
