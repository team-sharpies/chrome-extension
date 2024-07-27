// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick)

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log({ info: info.selectionText })

  switch (info.menuItemId) {
    case 'radio':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked)
      break
    case 'checkbox':
      if (tab) console.log('Checkbox item clicked. Status:', info.checked)
      break
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.')
  }

  if (info.menuItemId === 'summarizeSelection' && info.selectionText) {
    // Open the side panel
    chrome.sidePanel.open({ windowId: tab.windowId })

    // Send the selected text to the side panel
    chrome.runtime.sendMessage({
      action: 'displaySelection',
      text: info.selectionText,
    })
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
