import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const Sidepane: React.FC = () => {
  const [summary, setSummary] = useState<string>('')
  const { mutate, isError, error } = useSummary()

  const [selectedText, setSelectedText] = useState<string>('')
  const [isTextSet, setIsTextSet] = useState(false)

  const handleClick = () => {
    mutate(selectedText, {
      onSuccess: (data) => {
        setSummary(data)
      },
    })
  }

  useEffect(() => {
    const handleMessage = (message: { action: string; text?: string }) => {
      if (message.action === 'displaySelection' && message.text) {
        setSelectedText(message.text)
        setIsTextSet(true)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {
    if (isTextSet) {
      handleClick()
      setIsTextSet(false)
    }
  }, [isTextSet])

  return (
    <div className="sidepane">
      <h1>Streaming Response</h1>
      <p>{selectedText ?? ''}</p>
      {isError && (
        <div>
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}
      <p>{summary}</p>
    </div>
  )
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Sidepane />
  </QueryClientProvider>,
)
