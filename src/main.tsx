import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'

const App = () => {
  const [content, setContent] = useState<string>(
    '<p> ashdkasd </p> <img src = "https://picsum.photos/200/300" width ="75" height="112" /> <p> hello </p>'
  )

  return (
    <div style={{ padding: '1.5em' }}>
      <Tapwrite
        uploadFn={async (file) => {
          // const imgUtil = new ImagePickerUtils()
          // const url = await imgUtil.imageUrl(file)

          const simulateDelay = () =>
            new Promise<string>((resolve) => {
              setTimeout(() => {
                resolve('https://picsum.photos/600/400')
              }, 2000)
            })
          const url = await simulateDelay()
          return url || ''
        }}
        handleImageClick={(event) => console.log(`\n\nClick`, event)}
        handleImageDoubleClick={(event) =>
          console.log(`\n\nDouble Click`, event)
        }
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
