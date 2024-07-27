import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'
import getTopics from '../api/getTopics'

const Sidepane: React.FC = () => {
  const [summary, setSummary] = useState<string>('')
  const [topicsArr, setTopicsArr] = useState<string[] | null>(null)
  const { mutate, isError, error } = useSummary()
  const topics = getTopics()

  const [selectedText, setSelectedText] = useState<string>('')
  const [isTextSet, setIsTextSet] = useState(false)

  const handleClick = () => {
    mutate(selectedText, {
      onSuccess: (data) => {
        setSummary(data), getRelatedTopics()
      },
    })
  }

  const getRelatedTopics = () => {
    topics.mutate(selectedText, {
      onSuccess: (data) => {
        console.log('Data received:', data) // Debug log
        console.log(data[0])

        if (Array.isArray(data)) {
          setTopicsArr(data)
        } else {
          console.error('Data is not an array:', data) // Debug error
          console.log(data[0])
        }
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
      {/* <p>{selectedText ?? ''}</p> */}
      {isError && (
        <div>
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}
      <p>{summary}</p>
      <ul>
        {topicsArr &&
          (topicsArr.length > 0 ? (
            <>
              <h1>✨ Related Topics:</h1>

              {topicsArr.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </>
          ) : (
            <li>No topics available</li>
          ))}
      </ul>
    </div>
  )
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Sidepane />
  </QueryClientProvider>,
)
