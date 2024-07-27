import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const endpointUrl = 'http://localhost:3000/api/v1/llm/stream'
import getTopics from '../api/getTopics'

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
        setInput(message.text)
        setIsTextSet(true)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {

    if (!input) {
      return
    }


    // getting response from server based on the user prompt
    const fetchData = async () => {
      console.log('fetching data');

      const response = await fetch(endpointUrl, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      if (!response.ok || !response.body) {
        console.error('Error fetching data');
        console.log(await response.text());
        return
      }

      console.log('Data fetched successfully');


      // Here we start prepping for the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const loopRunner = true;


      while (loopRunner) {
        // Here we start reading the stream, until its done.
        const { value, done } = await reader.read();

        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        try {
          // each chunk could have multiple "data: {...}"
          // we need to split them and parse each one
          // we are only interested in the "choices" array

          // const decodedChunkJson = JSON.parse(decodedChunk.split('\n')
          //   .filter((line) => line.includes('data:'))[0].replace('data:', ''))

          const lines = decodedChunk.split('\n')
          const dataLines = lines.filter((line) => line.includes('data:') && !line.includes('DONE')).map((line) => line.replace('data:', ''))

          // now each data line is a json object
          const decodedChunkJsons = dataLines.map((line) => {
            try {
              return JSON.parse(line)
            } catch (error) {
              return null
            }
          })

          setOutput((answer) => {

            const output = decodedChunkJsons
              .flatMap((decodedChunkJson) => {
                if (decodedChunkJson && decodedChunkJson.choices) {
                  return decodedChunkJson.choices
                }
                return []
              }).map((choice) => choice.delta.content)
            console.log(answer + ' ' + output);
            return answer + ' ' + output
          })
        } catch (error) {
          continue
        }
      }
    }
    fetchData();
  }, [input])

  const handleClick = () => {
    const postData = {
      prompt: 'Who won the super bowl in 2024?',
    }
    mutate(postData, {
      onSuccess: (data) => {
        setOutput(data)
      },
    })
  }

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
