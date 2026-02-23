import { useMemo } from 'react'
import { priceLabel } from '../utils/format'

function ItemsTable({ items, onDelete, onEdit, onOpenAdd }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category)
      if (categoryCompare !== 0) {
        return categoryCompare
      }
      return a.name.localeCompare(b.name)
    })
  }, [items])

  return (
    <section className="card items-main">
      <div className="items-toolbar">
        <div>
          <h2>Menu Items</h2>
          <p className="muted">Add items from modal and attach them to existing categories.</p>
        </div>
        <button type="button" className="primary" onClick={onOpenAdd}>Add Item</button>
      </div>

      {items.length === 0 && (
        <div className="items-empty">
          <p className="muted">No items added yet.</p>
          <button type="button" onClick={onOpenAdd}>Add your first item</button>
        </div>
      )}

      {sortedItems.length > 0 && (
        <div className="items-table-wrap">
          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="item-name-cell">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{priceLabel(item.price)}</td>
                  <td>{item.description || '—'}</td>
                  <td>
                    {item.image_url ? (
                      <a href={item.image_url} target="_blank" rel="noreferrer">View</a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="item-actions-cell">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Edit item"
                      title="Edit item"
                      onClick={() => onEdit(item)}
                    >
                      <img src="/edit.png" alt="" aria-hidden="true" className="action-icon" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn danger-icon"
                      aria-label="Delete item"
                      title="Delete item"
                      onClick={() => onDelete(item.id)}
                    >
                      <img src="/delete.png" alt="" aria-hidden="true" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ItemsTable
