import React from 'react'
import ReactDOM from 'react-dom/client'
import { Tapwrite } from '../lib/main.tsx'
import { ImagePickerUtils } from '../lib/utils/imagePickerUtils.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '1.5em' }}>
      <Tapwrite uploadFn={async (file, tiptapEditorUtils) => {
        const imgUtil = new ImagePickerUtils()
        const url = await imgUtil.imageUrl(file)
        tiptapEditorUtils.setImage(url || '')
      }} content="" getContent={() => { }} />
    </div>
  </React.StrictMode>,
)
