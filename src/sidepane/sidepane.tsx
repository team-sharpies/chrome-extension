import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'
import getTopics from '../api/getTopics'

const relatedTopics = [
  'Deep Learning Architectures',
  'Natural Language Processing (NLP)',
  'Computer Vision',
]

const quizData = [
  {
    question:
      'What type of neural network is commonly used for natural language processing and speech recognition?',
    choices: [
      'Feedforward Neural Network',
      'Convolutional Neural Network',
      'Recurrent Neural Network',
      'Generative Adversarial Network',
    ],
    answer: 'Recurrent Neural Network',
  },
  {
    question:
      'Which neural network type is most often utilized for classification and computer vision tasks?',
    choices: [
      'Recurrent Neural Network',
      'Convolutional Neural Network',
      'Feedforward Neural Network',
      'Radial Basis Function Network',
    ],
    answer: 'Convolutional Neural Network',
  },
  {
    question:
      'What was commonly used to identify objects in images before the advent of convolutional neural networks?',
    choices: [
      'Deep Learning Algorithms',
      'Manual Feature Extraction Methods',
      'Support Vector Machines',
      'Neural Networks',
    ],
    answer: 'Manual Feature Extraction Methods',
  },
  {
    question:
      'What mathematical principles do convolutional neural networks leverage to identify patterns within an image?',
    choices: [
      'Calculus',
      'Linear Algebra',
      'Probability Theory',
      'Differential Equations',
    ],
    answer: 'Linear Algebra',
  },
  {
    question:
      'Why are graphical processing units (GPUs) often required to train convolutional neural networks?',
    choices: [
      'They are easier to program',
      'They consume less power',
      'They can handle computational demands',
      'They are cheaper than CPUs',
    ],
    answer: 'They can handle computational demands',
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
    <div className="sidepane bg-background p-2 w-screen min-h-screen font-sans">
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
                    ? '✅ Correct!'
                    : `❌ Incorrect - the answer is ${question.answer}`}
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
          <ul className="flex-col">
            {topicsArr &&
              (topicsArr.length > 0 ? (
                <>
                  <h2 className="text-[18px] font-bold pb-2">
                    ✨ Related Topics:
                  </h2>

                  {topicsArr.map((topic, i) => (
                    <>
                      <li
                        key={i}
                        className="border-none p-2 m-[5px] bg-cyan rounded-md text-white hover:cursor-pointer inline-flex"
                      >
                        {topic}
                      </li>
                      <br />
                    </>
                  ))}
                </>
              ) : (
                <li>No topics available</li>
              ))}
          </ul>
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
