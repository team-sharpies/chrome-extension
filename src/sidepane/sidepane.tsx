import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const Sidepane: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null)
  const { mutate, isError } = useSummary()

  const handleClick = () => {
    const postData = {
      prompt: 'Who won the Super Bowl in 2024?',
    }
    mutate(postData, {
      onSuccess: (data) => {
        if (data)
          // Assuming 'data' contains the response from the server
          setResponseData(data) // Adjust based on actual response structure
      },
      onError: (error) => {
        console.error('Error fetching data:', error)
      },
    })
  }

  return (
    <div className="sidepane">
      <h1>Response from AI Model</h1>
      <button onClick={handleClick}>Click me</button>
      {isError && <div>Error occurred while fetching data.</div>}
      {responseData && (
        <div>
          <h2>Response Summary:</h2>
          <p>{responseData}</p>
        </div>
      )}
    </div>
  )
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Sidepane />
  </QueryClientProvider>,
)
