export function getPageCapacity() {
  if (window.innerWidth < 560) {
    return 10
  }
  if (window.innerWidth < 900) {
    return 13
  }
  return 18
}

function itemUnits(item) {
  let units = 2
  if (item.description) {
    units += 1
  }
  if (item.image_url) {
    units += 1
  }
  return units
}

export function createBookPages(categories, categoryMeta, capacity) {
  const pages = []
  let currentPage = []
  let used = 0

  const pushPage = () => {
    if (currentPage.length) {
      pages.push(currentPage)
      currentPage = []
      used = 0
    }
  }

  Object.entries(categories).forEach(([category, items]) => {
    if (!items.length) {
      return
    }

    const headingUnits = 2
    if (used + headingUnits > capacity && currentPage.length > 0) {
      pushPage()
    }

    const meta = categoryMeta[category] || {}
    currentPage.push({
      type: 'heading',
      label: category,
      continued: false,
      description: meta.description || '',
      image_url: meta.image_url || '',
    })
    used += headingUnits

    items.forEach((item) => {
      const units = itemUnits(item)
      if (used + units > capacity && currentPage.length > 0) {
        pushPage()
        currentPage.push({
          type: 'heading',
          label: category,
          continued: true,
          description: meta.description || '',
          image_url: meta.image_url || '',
        })
        used += headingUnits
      }
      currentPage.push({ type: 'item', item })
      used += units
    })
  })

  pushPage()
  return pages
}
