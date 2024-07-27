// Define the interface for a single object
export interface Test {
  userId: number
  id: number
  title: string
  completed: boolean
}

// Function using async/await, now expecting an array of Test objects
export async function getTest(): Promise<Test[] | undefined> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const json: Test[] = await response.json()
    console.log(json)
    return json
  } catch (error) {
    console.error('Error fetching data:', error)
    return undefined
  }
}
