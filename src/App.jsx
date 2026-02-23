import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { apiRequest, getSavedUser, TOKEN_KEY, USER_KEY } from './api/client'
import AuthPanel from './components/AuthPanel'
import CategorySidebar from './components/CategorySidebar'
import DashboardQrTab from './components/DashboardQrTab'
import DashboardSidebar from './components/DashboardSidebar'
import ItemModal from './components/ItemModal'
import ItemsTable from './components/ItemsTable'
import PublicMenu from './components/PublicMenu'
import PreviewModal from './components/PreviewModal'
import QRModal from './components/QRModal'
import TemplateSidebar from './components/TemplateSidebar'

const ACTIVE_TAB_KEY = 'restaurant_menu_active_tab'
const DASHBOARD_TABS = new Set(['dashboard', 'menu', 'categories', 'items'])

function Dashboard() {
  const getInitialTab = () => {
    const saved = localStorage.getItem(ACTIVE_TAB_KEY)
    return saved && DASHBOARD_TABS.has(saved) ? saved : 'dashboard'
  }

  const [mode, setMode] = useState('login')
  const [authNotice, setAuthNotice] = useState('')
  const [activeTab, setActiveTab] = useState(getInitialTab)
  const [authLoading, setAuthLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [infoNotice, setInfoNotice] = useState('')

  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(getSavedUser())
  const [templates, setTemplates] = useState([])
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [qr, setQr] = useState(null)

  const [savingTemplate, setSavingTemplate] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [savingItem, setSavingItem] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)

  const [itemModal, setItemModal] = useState({ open: false, mode: 'add', item: null })
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState('')

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [token])

  const saveSession = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const clearSession = () => {
    setToken('')
    setUser(null)
    setItems([])
    setCategories([])
    setTemplates([])
    setQr(null)
    setQrModalOpen(false)
    setTemplatePreviewOpen(false)
    setPreviewTemplateId('')
    setInfoNotice('')
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoadingData(false)
        return
      }
      setLoadingData(true)
      try {
        const [meData, itemsData, categoriesData, qrData, templatesData] = await Promise.all([
          apiRequest('/auth/me', { headers: authHeaders }),
          apiRequest('/menu/items', { headers: authHeaders }),
          apiRequest('/menu/categories', { headers: authHeaders }),
          apiRequest('/restaurant/qr', { headers: authHeaders }),
          apiRequest('/restaurant/templates', { headers: authHeaders }),
        ])

        setUser(meData.user)
        localStorage.setItem(USER_KEY, JSON.stringify(meData.user))
        setItems(itemsData.items)
        setCategories(categoriesData.categories)
        setQr(qrData)
        setTemplates(templatesData.templates)
        setError('')
      } catch (err) {
        clearSession()
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }

    load()
  }, [authHeaders, token])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    const currentUrl = window.location.href
    const lockState = { dashboardLock: true, at: Date.now() }
    window.history.replaceState({ ...(window.history.state || {}), dashboardLock: true }, '', currentUrl)
    window.history.pushState(lockState, '', currentUrl)

    const handlePopState = () => {
      window.history.go(1)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [token])

  useEffect(() => {
    if (!DASHBOARD_TABS.has(activeTab)) {
      return
    }
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab)
  }, [activeTab])

  const handleRegister = async (payload) => {
    setAuthLoading(true)
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setMode('login')
      setAuthNotice(data.message || 'Registered successfully. Please login.')
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (payload) => {
    setAuthLoading(true)
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      saveSession(data.access_token, data.user)
      setAuthNotice('')
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const selectTemplate = async (templateId) => {
    setSavingTemplate(true)
    try {
      const data = await apiRequest('/restaurant/template', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template_id: templateId }),
      })
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingTemplate(false)
    }
  }

  const createTemplate = async (payload) => {
    setCreatingTemplate(true)
    try {
      const data = await apiRequest('/restaurant/templates', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      setTemplates((prev) => [...prev, data])
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setCreatingTemplate(false)
    }
  }

  const updateTemplate = async (templateId, payload) => {
    setSavingTemplate(true)
    try {
      const data = await apiRequest(`/restaurant/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      setTemplates((prev) => prev.map((tpl) => (tpl.id === templateId ? data : tpl)))
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingTemplate(false)
    }
  }

  const deleteTemplate = async (template) => {
    setSavingTemplate(true)
    try {
      const data = await apiRequest(`/restaurant/templates/${template.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== template.id))
      if (previewTemplateId === template.id) {
        setTemplatePreviewOpen(false)
        setPreviewTemplateId('')
      }
      if (data?.user) {
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      }
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingTemplate(false)
    }
  }

  const addCategory = async (payload) => {
    setSavingCategory(true)
    try {
      const data = await apiRequest('/menu/categories', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name.trim(),
          description: (payload.description || '').trim(),
          image_url: (payload.image_url || '').trim(),
        }),
      })
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingCategory(false)
    }
  }

  const updateCategory = async (categoryId, payload) => {
    setSavingCategory(true)
    try {
      const data = await apiRequest(`/menu/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name.trim(),
          description: (payload.description || '').trim(),
          image_url: (payload.image_url || '').trim(),
        }),
      })
      setCategories((prev) => prev.map((entry) => (entry.id === categoryId ? data : entry)))

      const itemsData = await apiRequest('/menu/items', { headers: authHeaders })
      setItems(itemsData.items)
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingCategory(false)
    }
  }

  const deleteCategory = async (category) => {
    setSavingCategory(true)
    try {
      await apiRequest(`/menu/categories/${category.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setCategories((prev) => prev.filter((entry) => entry.id !== category.id))
      setItems((prev) => prev.filter((item) => item.category !== category.name))
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingCategory(false)
    }
  }

  const createItem = async (payload) => {
    setSavingItem(true)
    try {
      const data = await apiRequest('/menu/items', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      setItems((prev) => [...prev, data])
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingItem(false)
    }
  }

  const updateItem = async (itemId, payload) => {
    setSavingItem(true)
    try {
      const data = await apiRequest(`/menu/items/${itemId}`, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      setItems((prev) => prev.map((item) => (item.id === itemId ? data : item)))
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSavingItem(false)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      await apiRequest(`/menu/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setItems((prev) => prev.filter((item) => item.id !== itemId))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }


  const submitItemModal = async (payload) => {
    if (itemModal.mode === 'edit' && itemModal.item?.id) {
      return updateItem(itemModal.item.id, payload)
    }
    return createItem(payload)
  }

  const viewTemplate = async (templateId) => {
    if (!templateId) {
      return
    }
    if (templateId !== user.template_id) {
      const switched = await selectTemplate(templateId)
      if (!switched) {
        return
      }
    }
    setPreviewTemplateId(templateId)
    setTemplatePreviewOpen(true)
  }

  const shareWithFallback = async ({ title, text, url, fallbackText, successText }) => {
    try {
      setError('')
      setInfoNotice('')
      if (navigator.share) {
        await navigator.share({ title, text, url })
        setInfoNotice(successText)
        return
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(fallbackText || url || '')
      setInfoNotice('Link copied to clipboard.')
      setError('')
    } catch {
      setError('Unable to share right now.')
    }
  }

  const shareQr = async () => {
    const menuUrl = `${window.location.origin}/menu/${user.id}`
    await shareWithFallback({
      title: `${user.restaurant_name} QR`,
      text: `Scan this QR to view the menu for ${user.restaurant_name}: ${menuUrl}`,
      url: menuUrl,
      fallbackText: `QR menu link: ${menuUrl}`,
      successText: 'QR details shared.',
    })
  }

  const shareMenu = async () => {
    const menuUrl = `${window.location.origin}/menu/${user.id}`
    await shareWithFallback({
      title: `${user.restaurant_name} Menu`,
      text: `Here is our menu link: ${menuUrl}`,
      url: menuUrl,
      fallbackText: menuUrl,
      successText: 'Menu link shared.',
    })
  }

  const openQrInNewTab = () => {
    const menuUrl = `${window.location.origin}/menu/${user.id}`
    const popup = window.open(menuUrl, '_blank', 'noopener,noreferrer')
    if (!popup) {
      setError('Popup blocked. Please allow popups and try again.')
    } else {
      setError('')
    }
  }

  const activePreviewTemplate =
    templates.find((tpl) => tpl.id === previewTemplateId) || templates.find((tpl) => tpl.id === user.template_id) || null

  if (!user || !token) {
    return (
      <main className="app-shell auth-shell">
        <AuthPanel
          mode={mode}
          notice={authNotice}
          onModeChange={setMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
          error={error}
        />
      </main>
    )
  }

  return (
    <main className="app-shell dashboard-shell">
      <div className="dashboard-layout">
        <DashboardSidebar user={user} activeTab={activeTab} onChange={setActiveTab} onLogout={clearSession} />

        <section className="dashboard-main">
          {error && <p className="error banner">{error}</p>}
          {infoNotice && <p className="success-note banner">{infoNotice}</p>}
          {loadingData && <p className="muted">Loading dashboard...</p>}

          {!loadingData && activeTab === 'dashboard' && (
            <DashboardQrTab
              items={items}
              categories={categories}
              qr={qr}
              onOpenQrModal={() => setQrModalOpen(true)}
              onShareQr={shareQr}
              onShareMenu={shareMenu}
              onOpenQrInNewTab={openQrInNewTab}
            />
          )}

          {!loadingData && activeTab === 'menu' && (
            <section className="items-layout single">
              <TemplateSidebar
                templates={templates}
                selectedTemplateId={user.template_id}
                savingTemplate={savingTemplate}
                creatingTemplate={creatingTemplate}
                onTemplateChange={selectTemplate}
                onCreateTemplate={createTemplate}
                onUpdateTemplate={updateTemplate}
                onDeleteTemplate={deleteTemplate}
                onViewTemplate={viewTemplate}
              />
            </section>
          )}

          {!loadingData && activeTab === 'categories' && (
            <section className="categories-layout">
              <CategorySidebar
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                loading={savingCategory}
              />
            </section>
          )}

          {!loadingData && activeTab === 'items' && (
            <section className="items-layout single">
              <ItemsTable
                items={items}
                onDelete={deleteItem}
                onEdit={(item) => setItemModal({ open: true, mode: 'edit', item })}
                onOpenAdd={() => setItemModal({ open: true, mode: 'add', item: null })}
              />
            </section>
          )}
        </section>
      </div>

      <ItemModal
        open={itemModal.open}
        mode={itemModal.mode}
        initialItem={itemModal.item}
        categories={categories}
        loading={savingItem}
        onClose={() => setItemModal({ open: false, mode: 'add', item: null })}
        onSubmit={submitItemModal}
      />

      <QRModal open={qrModalOpen} qr={qr} restaurantId={user.id} onClose={() => setQrModalOpen(false)} />

      <PreviewModal
        open={templatePreviewOpen}
        restaurantId={user.id}
        template={activePreviewTemplate}
        onClose={() => setTemplatePreviewOpen(false)}
      />
    </main>
  )
}

function App() {
  const isPublicMenu = window.location.pathname.startsWith('/menu/')
  return isPublicMenu ? <PublicMenu /> : <Dashboard />
}

export default App
