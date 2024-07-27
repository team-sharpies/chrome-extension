// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick)

// A generic onclick callback function.
function genericOnClick(info) {
  console.log({ info })
  switch (info.menuItemId) {
    case 'radio':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked)
      break
    case 'checkbox':
      // Checkbox item function
      console.log('Checkbox item clicked. Status:', info.checked)
      break
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.')
  }
}
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Summarize page',
    contexts: ['page'],
    id: 'summarizePage',
  })

  chrome.contextMenus.create({
    title: 'Summarize selection',
    contexts: ['selection'],
    id: 'summarizeSelection',
  })

  // Create a checkbox item.
  chrome.contextMenus.create({
    title: 'Enable Quiz mode',
    type: 'checkbox',
    id: 'checkbox',
  })
})
