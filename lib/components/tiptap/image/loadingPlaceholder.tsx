import * as React from 'react'

export const LoadingPlaceholder = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  const proseMirrorContainerDiv = document.querySelector('.node-uploadImage')

  return (
    <div className='image-placeholder'>
      <div className='blur'>
        <div
          className='bg-gray-200'
          style={{
            width: typeof width === 'number' ? `${width}px` : '300px',
            height: typeof height === 'number' ? `${height}px` : '200px',
            maxWidth: proseMirrorContainerDiv
              ? proseMirrorContainerDiv.clientWidth
              : 'auto',
            maxHeight:
              proseMirrorContainerDiv &&
              proseMirrorContainerDiv.clientWidth / (width / height)
                ? proseMirrorContainerDiv.clientWidth / (width / height)
                : 'auto',
          }}
        />
      </div>
    </div>
  )
}
