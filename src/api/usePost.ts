import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await fetch(`/api/posts/`, {
          method: 'POST',
          // below is the data to be sent to BE
          body: JSON.stringify({ data }),
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        })
        // below is the response from AI
        const summary = await response.json()
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
