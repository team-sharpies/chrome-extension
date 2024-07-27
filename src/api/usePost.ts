import { useMutation, useQueryClient } from '@tanstack/react-query'

interface PostData {
  prompt: string
}

export default function useSummary(endpointUrl: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: string): Promise<string> => {
      console.log(data)

      try {
        const prompt = {
          prompt: `Summarise the text below and give three related topics/concepts. Please do not respond with anything other than the summary. ${data}`,
        }

        const response = await fetch(
          'https://c436kvwp-3000.aue.devtunnels.ms/api/v1/llm/ask/',
          {
            method: 'POST',
            body: JSON.stringify(prompt),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
          },
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // const reader = response.body?.getReader()
        // const decoder = new TextDecoder()
        // let result = ''
        // let accumulatedChunks = ''

        // if (reader) {
        //   while (true) {
        //     const { done, value } = await reader.read()
        //     if (done) break

        //     // Decode the chunk
        //     const chunk = decoder.decode(value, { stream: true })
        //     accumulatedChunks += chunk

        //     // Process accumulated data
        //     let jsonLine = ''
        //     let jsonStart = accumulatedChunks.indexOf('{')
        //     let jsonEnd = accumulatedChunks.indexOf('}\n', jsonStart)

        //     while (jsonStart !== -1 && jsonEnd !== -1) {
        //       jsonLine = accumulatedChunks.slice(jsonStart, jsonEnd + 1)
        //       accumulatedChunks = accumulatedChunks.slice(jsonEnd + 2)

        //       // Remove 'data: ' prefix if it exists
        //       if (jsonLine.startsWith('data: ')) {
        //         jsonLine = jsonLine.slice(5)
        //       }

        //       try {
        //         const parsedChunk = JSON.parse(jsonLine)
        //         if (parsedChunk.choices && parsedChunk.choices[0].delta) {
        //           result += parsedChunk.choices[0].delta.content || ''
        //         }

        //         // Check for end of stream
        //         if (parsedChunk.choices[0].finish_reason === 'stop') {
        //           break
        //         }
        //       } catch (jsonError) {
        //         console.error('Error parsing JSON:', jsonError)
        //       }

        //       // Find next JSON object
        //       jsonStart = accumulatedChunks.indexOf('{')
        //       jsonEnd = accumulatedChunks.indexOf('}\n', jsonStart)
        //     }
        //   }
        // }
        const summary = await response.json()
        console.log(summary)

        return summary
      } catch (error) {
        console.error('Error fetching stream:', error)
        throw new Error('Error fetching stream')
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: (error) => {
      console.error('Mutation error:', error)
    },
  })
}
