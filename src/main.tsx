import React from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'
import { ImagePickerUtils } from '../lib/utils/imagePickerUtils.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '1.5em' }}>
      <Tapwrite
        uploadFn={async (file) => {
          // Simulate an async operation with a 5-second delay
          const simulateDelay = () =>
            new Promise<string>((resolve) => {
              setTimeout(() => {
                resolve('https://picsum.photos/600/400')
              }, 2000)
            })

          const url = await simulateDelay()
          return url || ''
        }}
        content='<p> ashdkasd </p> <img src = "https://picsum.photos/200/300" /> <p> hello </p>'
        getContent={(content) => {
          console.log(content)
        }}
        editorClass=''
      />
    </div>
  </React.StrictMode>
)
