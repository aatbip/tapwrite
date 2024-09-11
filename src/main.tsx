import React from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'
import { ImagePickerUtils } from '../lib/utils/imagePickerUtils.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '1.5em' }}>
      <Tapwrite
        uploadFn={async (file) => {
          const imgUtil = new ImagePickerUtils()
          const url = await imgUtil.imageUrl(file)
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
