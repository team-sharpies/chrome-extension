import { useMutation, useQueryClient } from '@tanstack/react-query'

// {
//   "userId": 1,
//   "id": 1,
//   "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//   "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// },

interface PostData {
  prompt: string
}

export default function useSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PostData) => {
      try {
        const response = await fetch(
          `https://fwgnbjwq-3000.usw3.devtunnels.ms/api/v1/llm/ask`,
          {
            method: 'POST',
            // below is the data to be sent to BE
            body: JSON.stringify(data),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // below is the response from AI
        const summary = await response.json()
        console.log(summary)
        return summary
      } catch (error) {
        console.log(error)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
