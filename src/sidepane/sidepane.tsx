import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { getTest } from '../api/getTest'
import useSummary from '../api/usePost'

const Sidepane: React.FC = () => {
  // Fetch data using react-query's useQuery hook
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['test'],
    queryFn: getTest,
  })

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Handle error state
  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    )
  }

  // If data is fetched successfully, render it
  return (
    <div className="sidepane">
      <h1>Fetched Data</h1>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>User ID: {item.userId}</p>
            <p>Completed: {item.completed ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          const postData = {
            prompt: 'Who won the super bowl in 2024?',
          }
          useSummary().mutate(postData)
        }}
      >
        CLICK MEEE
      </button>
    </div>
  )
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Sidepane />
  </QueryClientProvider>,
)
