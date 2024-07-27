// frontend.js
async function fetchStream() {
  try {
    const response = await fetch('/stream')

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
