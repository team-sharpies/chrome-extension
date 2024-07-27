import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'
import getTopics from '../api/getTopics'

const Sidepane: React.FC = () => {
  const [summary, setSummary] = useState<string>('')
  const [topicsArr, setTopicsArr] = useState<string[] | null>(null)
  const [quizModeOn, setQuizModeOn] = useState(false)
  const { mutate, isError, error } = useSummary()
  const topics = getTopics()

  const [selectedText, setSelectedText] = useState<string>('')
  const [isTextSet, setIsTextSet] = useState(false)

  const toggleQuizMode = () => {
    setQuizModeOn((prevMode) => !prevMode)
  }

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
    <div className="sidepane bg-background p-2 w-screen h-screen font-sans">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          onChange={toggleQuizMode} // Calls the function when toggled
          checked={quizModeOn} // Keeps the switch state in sync
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan"></div>
        <span className="ms-3 text-sm font-medium text-black">Quiz Mode</span>
      </label>

      {quizModeOn ? (
        <div>
          <h1 className="text-2xl font-bold">Quiz Mode</h1>
          <button
            className="border-2 border-solid border-cyan p-2 bg-cyan rounded-md text-white"
            onClick={handleClick}
          >
            Get response
          </button>
          {isError && (
            <div>
              Error:{' '}
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}
          <div className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            <h2>Q:</h2>
            <p className="text-md p-[6px] py-2 my-2">{summary}</p>
          </div>
          <div className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            <h2>Q:</h2>
            <p className="text-md p-[6px] py-2 my-2">{summary}</p>
          </div>
          <div className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            <h2>Q:</h2>
            <p className="text-md p-[6px] py-2 my-2">{summary}</p>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">Summary</h1>
          <button
            className="border-2 border-solid border-cyan p-2 bg-cyan rounded-md text-white"
            onClick={handleClick}
          >
            Get response
          </button>
          {isError && (
            <div>
              Error:{' '}
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}
          <p className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            {summary}
          </p>
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
