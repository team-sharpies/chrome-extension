import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const endpointUrl = 'http://localhost:3000/api/v1/llm'

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
  const [quizModeOn, setQuizModeOn] = useState(false)
  const [isStreamingDone, setIsStreamingDone] = useState<boolean | null>(false)

  const [selectedText, setSelectedText] = useState<string>('')

  const toggleQuizMode = () => {
    setQuizModeOn((prevMode) => !prevMode)
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
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {
    if (!selectedText) {
      return
    }



    // getting response from server based on the user prompt
    const fetchData = async () => {

      const response = await fetch(endpointUrl + '/stream', {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: selectedText }),
      });
      if (!response.ok || !response.body) {
        console.error('Error fetching data');
        console.log(await response.text());
        return
      }

      // Here we start prepping for the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const loopRunner = true;


      while (loopRunner) {
        // Here we start reading the stream, until its done.
        const { value, done } = await reader.read();

        if (done) {
          setIsStreamingDone(true);
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        try {

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

          setSummary((answer) => {
            const output = decodedChunkJsons
              .flatMap((decodedChunkJson) => {
                if (decodedChunkJson && decodedChunkJson.choices) {
                  return decodedChunkJson.choices
                }
                return []
              }).map((choice) => choice.delta.content)
            return answer + output.join(' ')
          })
        } catch (error) {
          continue
        }
      }
    }
    fetchData();
  }, [selectedText])



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
        <span className="ms-3 text-md font-medium text-black">Quiz me 💡</span>
      </label>

      {quizModeOn ? (
        <div>
          <h1 className="text-2xl font-bold">Quiz Mode</h1>



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
          <p className="text-md p-[6px] py-2 my-2 border-solid rounded-md border-gray-500 border-[1px]">
            {summary}
          </p>
          <ul className="flex-col">
            {
              isStreamingDone &&
              relatedTopics &&
              (relatedTopics.length > 0 ? (
                <>
                  <h2 className="text-[20px] font-bold pb-2">
                    <span style={{ fontSize: '1.5em' }}>✨</span> Related
                    Topics:
                  </h2>

                  {relatedTopics.map((topic, i) => (
                    <>
                      <li
                        key={i}
                        className="border-none p-[5px] m-[2px] bg-cyan rounded-md text-white hover:cursor-pointer inline-flex"
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
