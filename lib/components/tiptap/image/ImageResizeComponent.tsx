import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'
import placeholderImage from '../../../assets/placeholder.svg'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)

  const handleImageLoad = () => {
    setLoading(false)
  }

  const startResize = (
    startX: number,
    startY: number,
    image: HTMLImageElement,
    side: 'left' | 'right'
  ) => {
    const startSize = { x: image.clientWidth, y: image.clientHeight }

    const onMove = (moveX: number, moveY: number) => {
      let newWidth = startSize.x
      let newHeight = startSize.y

      if (side === 'left') {
        newWidth = startSize.x + (startX - moveX)
      } else {
        newWidth = startSize.x - startX + moveX
      }

      newHeight = startSize.y - startY + moveY

      // Ensure minimum size
      newWidth = Math.max(newWidth, 200)
      newHeight = Math.max(newHeight, 200)

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
    }

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      onMove(mouseMoveEvent.pageX, mouseMoveEvent.pageY)
    }

    const onTouchMove = (touchMoveEvent: TouchEvent) => {
      onMove(touchMoveEvent.touches[0].pageX, touchMoveEvent.touches[0].pageY)
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', stopResize)
    document.body.addEventListener('touchmove', onTouchMove)
    document.body.addEventListener('touchend', stopResize)
  }

  const handleMouseDown = (
    mouseDownEvent: React.MouseEvent<HTMLImageElement>,
    side: 'left' | 'right'
  ) => {
    const parent = (mouseDownEvent.target as HTMLElement).closest(
      '.image-resizer'
    )
    const image = parent?.querySelector('img.postimage') as HTMLImageElement
    if (!image) return

    startResize(mouseDownEvent.pageX, mouseDownEvent.pageY, image, side)
  }

  const handleTouchStart = (
    touchStartEvent: React.TouchEvent<HTMLImageElement>,
    side: 'left' | 'right'
  ) => {
    const parent = (touchStartEvent.target as HTMLElement).closest(
      '.image-resizer'
    )
    const image = parent?.querySelector('img.postimage') as HTMLImageElement
    if (!image) return

    const touch = touchStartEvent.touches[0]
    startResize(touch.pageX, touch.pageY, image, side)

    // Prevent default scroll behavior while resizing
    touchStartEvent.preventDefault()
  }

  return (
    <NodeViewWrapper className='image-resizer'>
      {loading && (
        <div className='image-placeholder'>
          <div className='blur'>
            <img src={placeholderImage} alt='Loading placeholder' />
          </div>
        </div>
      )}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <div
          className='resize-trigger left'
          onMouseDown={(e: React.MouseEvent<HTMLImageElement>) =>
            handleMouseDown(e, 'left')
          }
          onTouchStart={(e: React.TouchEvent<HTMLImageElement>) =>
            handleTouchStart(e, 'left')
          }
        >
          <Resize />
        </div>
        <div
          className='resize-trigger right'
          onMouseDown={(e: React.MouseEvent<HTMLImageElement>) =>
            handleMouseDown(e, 'right')
          }
          onTouchStart={(e: React.TouchEvent<HTMLImageElement>) =>
            handleTouchStart(e, 'right')
          }
        >
          <Resize />
        </div>
        <img
          {...props.node.attrs}
          className='postimage'
          onLoad={handleImageLoad}
        />
      </div>
    </NodeViewWrapper>
  )
}
