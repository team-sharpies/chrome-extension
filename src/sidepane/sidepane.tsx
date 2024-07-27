import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const Sidepane: React.FC = () => {
  const [summary, setSummary] = useState<string>('')
  const [quizModeOn, setQuizModeOn] = useState(false)
  const { mutate, isError, error } = useSummary() // Ensure `useSummary` is returning `mutate`

  const toggleQuizMode = () => {
    setQuizModeOn((prevMode) => !prevMode)
  }

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
          <p className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            Blah blah blah blah blah
          </p>
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
            Blah blah blah blah blah
          </p>
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
