import React, { useState } from 'react'
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

  return (
    <div className="sidepane">
      <h1>Streaming Response</h1>
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
