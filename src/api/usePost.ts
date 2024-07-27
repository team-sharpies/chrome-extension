import { useMutation, useQueryClient } from '@tanstack/react-query'

interface PostData {
  prompt: string
}

export default function useSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PostData): Promise<string> => {
      try {
        const response = await fetch(
          'https://fg5mcr3m-3000.usw3.devtunnels.ms/api/v1/llm/ask/',
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
          },
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let result = ''
        let accumulatedChunks = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true })
            accumulatedChunks += chunk

            // Process accumulated data
            let jsonLine = ''
            let jsonStart = accumulatedChunks.indexOf('{')
            let jsonEnd = accumulatedChunks.indexOf('}\n', jsonStart)

            while (jsonStart !== -1 && jsonEnd !== -1) {
              jsonLine = accumulatedChunks.slice(jsonStart, jsonEnd + 1)
              accumulatedChunks = accumulatedChunks.slice(jsonEnd + 2)

              // Remove 'data: ' prefix if it exists
              if (jsonLine.startsWith('data: ')) {
                jsonLine = jsonLine.slice(5)
              }

              try {
                const parsedChunk = JSON.parse(jsonLine)
                if (parsedChunk.choices && parsedChunk.choices[0].delta) {
                  result += parsedChunk.choices[0].delta.content || ''
                }

                // Check for end of stream
                if (parsedChunk.choices[0].finish_reason === 'stop') {
                  break
                }
              } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError)
              }

              // Find next JSON object
              jsonStart = accumulatedChunks.indexOf('{')
              jsonEnd = accumulatedChunks.indexOf('}\n', jsonStart)
            }
          }
        }

        return result
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
