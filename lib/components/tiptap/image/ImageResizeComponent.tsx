import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'
import { LoadingPlaceholder } from './loadingPlaceholder'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)

  const handleImageLoad = () => {
    setLoading(false)
  }

  let startX = 0
  let startY = 0
  let startSize = { x: 0, y: 0 }
  let image: HTMLImageElement | null = null
  let resizeSide: 'left' | 'right' = 'right'

  const onMove = (moveX: number, moveY: number) => {
    if (!image) return

    let newWidth = startSize.x
    let newHeight = startSize.y

    if (resizeSide === 'left') {
      newWidth = startSize.x + (startX - moveX)
    } else {
      newWidth = startSize.x - startX + moveX
    }

    newHeight = startSize.y - startY + moveY

    // Ensure minimum size
    newWidth = Math.max(newWidth, 200)
    newHeight = Math.max(newHeight, 200)

    console.log(`Resizing to: width=${newWidth}, height=${newHeight}`)

    props.updateAttributes({
      width: newWidth,
      height: newHeight,
    })
  }

  const stopResize = () => {
    document.body.removeEventListener('mousemove', onMouseMove)
    document.body.removeEventListener('mouseup', stopResize)
    document.body.removeEventListener('touchmove', onTouchMove)
    document.body.removeEventListener('touchend', stopResize)
    console.log('Stopped resizing')
  }

  const onMouseMove = (mouseMoveEvent: MouseEvent) => {
    onMove(mouseMoveEvent.pageX, mouseMoveEvent.pageY)
  }

  const onTouchMove = (touchMoveEvent: TouchEvent) => {
    onMove(touchMoveEvent.touches[0].pageX, touchMoveEvent.touches[0].pageY)
  }

  const startResize = (
    initialX: number,
    initialY: number,
    img: HTMLImageElement,
    side: 'left' | 'right'
  ) => {
    startX = initialX
    startY = initialY
    image = img
    resizeSide = side

    startSize = { x: img.clientWidth, y: img.clientHeight }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', stopResize)
    document.body.addEventListener('touchmove', onTouchMove)
    document.body.addEventListener('touchend', stopResize)

    console.log('Started resizing', { startX, startY, startSize, side })
  }

  const handleMouseDown = (
    mouseDownEvent: React.MouseEvent<HTMLDivElement>,
    side: 'left' | 'right'
  ) => {
    mouseDownEvent.preventDefault()
    const parent = (mouseDownEvent.target as HTMLElement).closest(
      '.image-resizer'
    )
    const img = parent?.querySelector('img.postimage') as HTMLImageElement
    if (!img) return

    startResize(mouseDownEvent.pageX, mouseDownEvent.pageY, img, side)
  }

  const handleTouchStart = (
    touchStartEvent: React.TouchEvent<HTMLDivElement>,
    side: 'left' | 'right'
  ) => {
    touchStartEvent.preventDefault()
    const parent = (touchStartEvent.target as HTMLElement).closest(
      '.image-resizer'
    )
    const img = parent?.querySelector('img.postimage') as HTMLImageElement
    if (!img) return

    const touch = touchStartEvent.touches[0]
    startResize(touch.pageX, touch.pageY, img, side)
  }

  return (
    <NodeViewWrapper
      className='image-resizer'
      style={{
        outline: props.selected ? '3px solid #0C41BB' : 'none',
        borderColor: props.selected ? '#625df580' : 'none',
        borderRadius: '5px',
      }}
    >
      {loading && <LoadingPlaceholder />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <div
          className='resize-trigger left'
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseDown(e, 'left')
          }
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleTouchStart(e, 'left')
          }
        >
          <Resize />
        </div>
        <div
          className='resize-trigger right'
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseDown(e, 'right')
          }
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleTouchStart(e, 'right')
          }
        >
          <Resize />
        </div>
        <div>
          <img
            {...props.node.attrs}
            className='postimage'
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
