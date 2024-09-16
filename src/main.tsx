import React from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'
import { ImagePickerUtils } from '../lib/utils/imagePickerUtils.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '1.5em' }}>
      <Tapwrite
        uploadFn={async (file) => {
          const simulateDelay = (ms: number) =>
            new Promise<string>((resolve) => setTimeout(resolve, ms))

          await simulateDelay(2000) // 2 second delay

          const url =
            'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          return url
        }}
        content='<p> ashdkasd </p> <p> hello </p>'
        getContent={(content) => {
          // console.log(content)
        }}
        editorClass=''
      />
    </div>
  </React.StrictMode>
)
