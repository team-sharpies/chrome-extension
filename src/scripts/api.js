export async function fetchStream() {
  console.log('Starting fetchStream...') // Log at the start
  try {
    // TODO: replace this call with the backend's forwarded port
    const response = await fetch('https://fwgnbjwq-3000.usw3.devtunnels.ms/')
    console.log(response)

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const summaryContent = document.getElementById('summary')

    async function processText() {
      const { done, value } = await reader.read()

      if (done) {
        console.log('Stream complete')
        summaryContent.innerHTML += '<p>Stream complete</p>' // Optional: Indicate completion
        return
      }

      // Decode and append the chunk to the summaryContent
      const chunk = decoder.decode(value, { stream: true })
      summaryContent.innerHTML += `<p>${chunk}</p>`

      // Continue reading the next chunk
      await processText()
    }

    await processText()
  } catch (error) {
    console.error('Error:', error)
    const summaryContent = document.getElementById('summary')
    summaryContent.innerHTML = '<p>Error occurred while fetching data.</p>' // Optional: Show error message in the DOM
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

fetchStream()
