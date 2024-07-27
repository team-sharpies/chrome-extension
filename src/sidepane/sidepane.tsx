import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSummary from '../api/usePost'

const endpointUrl = 'http://localhost:3000/api/v1/llm/stream'

const Sidepane: React.FC = () => {
  const [output, setOutput] = useState<string>('')
  const [input, setInput] = useState<string>('')
  const { mutate, isError, error } = useSummary(endpointUrl) // Ensure `useSummary` is returning `mutate`

  useEffect(() => {
    const handleMessage = (message: { action: string; text?: string }) => {
      if (message.action === 'displaySelection' && message.text) {
        console.log(message.text)

        setInput(message.text)
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

  return (
    <div className="sidepane">
      <h1>Streaming Response</h1>
      <p>{input}</p>
      <button onClick={handleClick}>Get response</button>
      {isError && (
        <div>
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}
      <p>{output}</p>
    </div>
  )

}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Sidepane />
  </QueryClientProvider>,
)
