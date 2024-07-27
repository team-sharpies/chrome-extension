import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const Sidepane: React.FC = () => {
  const [summary, setSummary] = useState<string>('')
  const { mutate, isError, error } = useSummary() // Ensure `useSummary` is returning `mutate`

  const handleClick = () => {
    const postData = {
      prompt: 'Who won the super bowl in 2024?',
    }
    mutate(postData, {
      onSuccess: (data) => {
        setSummary(data)
      },
    })
  }

  const [selectedText, setSelectedText] = useState<string>('')

  useEffect(() => {
    const handleMessage = (message: { action: string; text?: string }) => {
      if (message.action === 'displaySelection' && message.text) {
        console.log(message.text)

        setSelectedText(message.text)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return (
    <div className="sidepane">
      <h1>Streaming Response</h1>
      <p>{selectedText ?? ''}</p>
      <button onClick={handleClick}>Get response</button>
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
