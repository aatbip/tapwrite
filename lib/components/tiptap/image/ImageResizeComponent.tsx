import React, { useState, useCallback } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'
import { LoadingPlaceholder } from './loadingPlaceholder'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)

  const handleImageLoad = useCallback(() => {
    setLoading(false)
  }, [])

  const startResize = useCallback(
    (
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

        // Use a timeout to debounce rapid updates
        setTimeout(() => {
          props.updateAttributes({
            width: newWidth,
            height: newHeight,
          })
        }, 0)
      }

      const stopResize = () => {
        document.body.removeEventListener('mousemove', onMouseMove)
        document.body.removeEventListener('mouseup', stopResize)
        document.body.removeEventListener('touchmove', onTouchMove)
        document.body.removeEventListener('touchend', stopResize)
      }

      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        mouseMoveEvent.preventDefault()
        onMove(mouseMoveEvent.pageX, mouseMoveEvent.pageY)
      }

      const onTouchMove = (touchMoveEvent: TouchEvent) => {
        touchMoveEvent.preventDefault()
        onMove(touchMoveEvent.touches[0].pageX, touchMoveEvent.touches[0].pageY)
      }

      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', stopResize)
      document.body.addEventListener('touchmove', onTouchMove)
      document.body.addEventListener('touchend', stopResize)
    },
    [props]
  )

  const handleMouseDown = useCallback(
    (
      mouseDownEvent: React.MouseEvent<HTMLDivElement>,
      side: 'left' | 'right'
    ) => {
      mouseDownEvent.preventDefault()
      const parent = (mouseDownEvent.target as HTMLElement).closest(
        '.image-resizer'
      )
      const image = parent?.querySelector('img.postimage') as HTMLImageElement
      if (!image) return

      startResize(mouseDownEvent.pageX, mouseDownEvent.pageY, image, side)
    },
    [startResize]
  )

  const handleTouchStart = useCallback(
    (
      touchStartEvent: React.TouchEvent<HTMLDivElement>,
      side: 'left' | 'right'
    ) => {
      touchStartEvent.preventDefault()
      const parent = (touchStartEvent.target as HTMLElement).closest(
        '.image-resizer'
      )
      const image = parent?.querySelector('img.postimage') as HTMLImageElement
      if (!image) return

      const touch = touchStartEvent.touches[0]
      startResize(touch.pageX, touch.pageY, image, side)
    },
    [startResize]
  )

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
          onMouseDown={(e) => handleMouseDown(e, 'left')}
          onTouchStart={(e) => handleTouchStart(e, 'left')}
        >
          <Resize />
        </div>
        <div
          className='resize-trigger right'
          onMouseDown={(e) => handleMouseDown(e, 'right')}
          onTouchStart={(e) => handleTouchStart(e, 'right')}
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
