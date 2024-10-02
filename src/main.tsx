import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'
import { ImagePickerUtils } from '../lib/utils/imagePickerUtils.ts'

const App = () => {
  const [content, setContent] = useState<string>(
    '<p> ashdkasd </p> <img src = "https://picsum.photos/200/300" width ="75" height="112" /> <p> hello </p>'
  )

  return (
    <div style={{ padding: '1.5em' }}>
      <Tapwrite
        uploadFn={async (file) => {
          // Simulate an async operation with a 2-second delay
          const simulateDelay = () =>
            new Promise<string>((resolve) => {
              setTimeout(() => {
                resolve('https://picsum.photos/600/400')
              }, 2000)
            })

          const url = await simulateDelay()
          return url || ''
        }}
        content={content}
        getContent={(newContent) => {
          setContent(newContent)
          console.log(newContent)
        }}
        editorClass=''
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
