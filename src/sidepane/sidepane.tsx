import React from 'react'
import { createRoot } from 'react-dom/client'

const Sidepane: React.FC = () => {
  return (
    <div className="sidepane">
      <h1>Hello uharu and hannad</h1>
      <p>test</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Sidepane />)
