import { useMutation, useQueryClient } from '@tanstack/react-query'

interface PostData {
  prompt: string
}

// Daphs port:   https://fwgnbjwq-3000.usw3.devtunnels.ms/api/v1/llm/ask

export default function useSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PostData): Promise<string> => {
      try {
        const response = await fetch(
          'https://fg5mcr3m-3000.usw3.devtunnels.ms/',
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let result = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += decoder.decode(value, { stream: true })
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
