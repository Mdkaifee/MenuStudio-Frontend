import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client'
import { createBookPages, getPageCapacity } from '../utils/book'
import { priceLabel } from '../utils/format'

function PublicMenu() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menu, setMenu] = useState(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [flipDirection, setFlipDirection] = useState('next')
  const [pageCapacity, setPageCapacity] = useState(getPageCapacity())

  const restaurantId = useMemo(() => {
    const path = window.location.pathname
    const parts = path.split('/').filter(Boolean)
    return parts.length >= 2 ? parts[1] : ''
  }, [])

  useEffect(() => {
    const onResize = () => setPageCapacity(getPageCapacity())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest(`/public/menu/${restaurantId}`)
        setMenu(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [restaurantId])

  const pages = useMemo(() => {
    if (!menu) {
      return []
    }
    return createBookPages(menu.categories, menu.category_meta || {}, pageCapacity)
  }, [menu, pageCapacity])

  useEffect(() => {
    setPageIndex(0)
  }, [menu, pageCapacity])

  if (loading) {
    return (
      <main className="public-menu-wrap">
        <p>Loading menu...</p>
      </main>
    )
  }

  if (error || !menu) {
    return (
      <main className="public-menu-wrap">
        <p className="error">{error || 'Menu not found'}</p>
      </main>
    )
  }

  const totalPages = pages.length || 1
  const currentPage = pages[pageIndex] || []

  const goNext = () => {
    setFlipDirection('next')
    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
  }

  const goPrev = () => {
    setFlipDirection('prev')
    setPageIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <main className={`public-menu-wrap template-${menu.template_style_id || menu.template_id}`}>
      <div className="public-menu book-shell">
        <h1>{menu.restaurant_name}</h1>

        {totalPages > 1 && (
          <p className="muted book-hint">
            This menu has multiple pages. Use flip buttons to see more.
          </p>
        )}

        <section className={`book-page ${flipDirection}`} key={`${pageIndex}-${flipDirection}`}>
          {currentPage.map((entry, idx) => {
            if (entry.type === 'heading') {
              return (
                <div key={`${entry.label}-${idx}`} className="book-category-head">
                  {entry.image_url && <img src={entry.image_url} alt={entry.label} className="category-cover" />}
                  <h2 className="book-heading">
                    {entry.label}{entry.continued ? ' (cont.)' : ''}
                  </h2>
                  {entry.description && <p className="book-category-desc">{entry.description}</p>}
                </div>
              )
            }

            const item = entry.item
            return (
              <article className="menu-item" key={item.id}>
                <div>
                  {item.image_url && <img src={item.image_url} alt={item.name} className="menu-image" />}
                  <h3>{item.name}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
                <strong>{priceLabel(item.price)}</strong>
              </article>
            )
          })}
          {!currentPage.length && <p>No items yet.</p>}
        </section>

        {totalPages > 1 && (
          <div className="book-controls">
            <button type="button" onClick={goPrev} disabled={pageIndex === 0}>Flip Back</button>
            <span>Page {pageIndex + 1} of {totalPages}</span>
            <button type="button" onClick={goNext} disabled={pageIndex >= totalPages - 1}>Flip Next</button>
          </div>
        )}
      </div>
    </main>
  )
}

export default PublicMenu
