import { fetchStream } from './api'

async function displayStreamData() {
  const summaryContent = document.getElementById('summary')

  summaryContent.textContent = 'Hello world'

  // try {
  //   // Fetch the stream
  //   const response = await fetchStream()

  //   if (!response.body) {
  //     throw new Error('Response body is null')
  //   }

  //   const reader = response.body.getReader()
  //   const decoder = new TextDecoder()

  //   async function processText() {
  //     const { done, value } = await reader.read()

  //     if (done) {
  //       console.log('Stream complete')
  //       return
  //     }

  //     // Decode and append the chunk to the summaryContent
  //     const chunk = decoder.decode(value, { stream: true })
  //     summaryContent.innerHTML += `<p>${chunk}</p>`

  //     // Continue reading the next chunk
  //     await processText()
  //   }

  //   await processText()
  // } catch (error) {
  //   console.error('Error fetching stream:', error)
  // }
}

// Call the function to start fetching and displaying data
displayStreamData()
