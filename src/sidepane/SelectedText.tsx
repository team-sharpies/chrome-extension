// src/components/SelectedText.tsx
import React, { useEffect, useState } from 'react'

interface StorageChange {
  oldValue?: string
  newValue?: string
}

interface StorageChanges {
  [key: string]: StorageChange
}

const SelectedText: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('')

  useEffect(() => {
    // Get the selected text from storage
    chrome.storage.local.get('selectedText', (result) => {
      if (result.selectedText) {
        setSelectedText(result.selectedText)
      }
    })

    // Listen for changes to the selected text
    const handleStorageChange = (changes: StorageChanges, areaName: string) => {
      if (areaName === 'local' && changes.selectedText) {
        setSelectedText(changes.selectedText.newValue ?? '')
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  return (
    <div>
      <h2>Selected Text</h2>
      <p>{selectedText ?? ''}</p>
    </div>
  )
}

export default SelectedText
