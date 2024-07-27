import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'
import getTopics from '../api/getTopics'

const quizData = [
  {
    question: 'What is the capital of the fictional country of Westeros?',
    choices: ["King's Landing", 'Winterfell', 'Rivendell', 'Hogsmeade'],
    answer: "King's Landing",
  },
  {
    question:
      'In the fictional universe of Star Trek, what is the name of the starship captained by Jean-Luc Picard?',
    choices: ['USS Voyager', 'USS Enterprise', 'USS Defiant', 'USS Discovery'],
    answer: 'USS Enterprise',
  },
  {
    question:
      "Which fictional language is spoken by the elves in J.R.R. Tolkien's Middle-earth?",
    choices: ['Klingon', 'Dothraki', 'Elvish', 'Valyrian'],
    answer: 'Elvish',
  },
  {
    question:
      'What is the name of the wizarding school attended by Harry Potter?',
    choices: ['Durmstrang', 'Beauxbatons', 'Hogwarts', 'Ilvermorny'],
    answer: 'Hogwarts',
  },
  {
    question: "In the Star Wars universe, what is the name of Han Solo's ship?",
    choices: ['Millennium Falcon', 'X-Wing', 'Star Destroyer', 'TIE Fighter'],
    answer: 'Millennium Falcon',
  },
]

const Sidepane: React.FC = () => {
  const [answers, setAnswers] = useState<
    { selected: string; correct: boolean }[]
  >(quizData.map(() => ({ selected: '', correct: false })))
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

  const handleChoice = (choice, questionIdx) => {
    const currentQuestion = quizData[questionIdx]
    const correct = choice === currentQuestion.answer

    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, idx) =>
        idx === questionIdx ? { selected: choice, correct } : answer,
      ),
    )
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
          onChange={toggleQuizMode}
          checked={quizModeOn}
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

          {quizData.map((question, questionIdx) => (
            <div
              key={questionIdx}
              className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]"
            >
              <h2>{question.question}</h2>
              {question.choices.map((choice, choiceIdx) => (
                <button
                  key={choiceIdx}
                  onClick={() => handleChoice(choice, questionIdx)}
                  className="border-2 border-solid border-cyan p-[2px] m-2 bg-cyan rounded-md text-white"
                >
                  {choice}
                </button>
              ))}
              {answers[questionIdx].selected && (
                <div className="answer-feedback">
                  {answers[questionIdx].correct
                    ? 'Yes'
                    : `No - it was ${question.answer}`}
                </div>
              )}
            </div>
          ))}
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
      <ul>
        {topicsArr &&
          (topicsArr.length > 0 ? (
            <>
              <h1>✨ Related Topics:</h1>

              {topicsArr.map((topic, i) => (
                <li
                  key={i}
                  className="border-none p-2 m-3 bg-cyan rounded-md text-white"
                >
                  {topic}
                </li>
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
