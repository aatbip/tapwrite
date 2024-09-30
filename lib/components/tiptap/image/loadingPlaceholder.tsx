import * as React from 'react'

export const LoadingPlaceholder = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return (
    <div className='image-placeholder'>
      <div className='blur'>
        <div
          className='bg-gray-200'
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>
    </div>
  )
}
