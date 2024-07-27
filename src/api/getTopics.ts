import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: string): Promise<string[]> => {
      console.log(data)

      // mutationFn: async (): Promise<any> => {
      try {
        const prompt = {
          prompt: `Give three topics/concepts that are related/relevant to the text below. Please do not respond with anything other than these concepts and give the data in the shape of an array; ["related-topic1","related-topic2","related-topic3"]. ${data}`,
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

        const responseData = await response.json()
        console.log(responseData)

        // If responseData is a string, parse it
        let topics: string[]
        if (typeof responseData === 'string') {
          topics = JSON.parse(responseData)
        } else {
          topics = responseData
        }
        console.log(topics)

        return topics
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
