// frontend.js
export async function fetchStream() {
  console.log('Starting fetchStream...') // Log at the start
  try {
    const response = await mockFetch('/stream')

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()

    async function processText() {
      const { done, value } = await reader.read()

      if (done) {
        console.log('Stream complete')
        return
      }

      // Process the chunk (value) here
      console.log('Received chunk:', new TextDecoder().decode(value))

      // Continue reading the next chunk
      await processText()
    }

    await processText()
  } catch (error) {
    console.error('Error:', error)
  }
}

// Mocked stream to test our API
async function mockFetch(url) {
  console.log(`Fetching from: ${url}`) // Log to ensure mockFetch is called

  const mockResponse = {
    body: {
      getReader() {
        let count = 0
        return {
          async read() {
            console.log('Reading chunk', count) // Log to trace reader activity
            if (count < 5) {
              count++
              return {
                done: false,
                value: new TextEncoder().encode(`Mock message ${count}`),
              }
            } else {
              return { done: true, value: null }
            }
          },
        }
      },
    },
  }

  return mockResponse
}
