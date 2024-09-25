import React, { useState, useCallback, useEffect, useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'
import { LoadingPlaceholder } from './loadingPlaceholder'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [proseMirrorContainerWidth, setProseMirrorContainerWidth] = useState(0)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    // Setup container width on component mount
    const proseMirrorContainerDiv = document.querySelector('.ProseMirror')
    if (proseMirrorContainerDiv) {
      setProseMirrorContainerWidth(proseMirrorContainerDiv.clientWidth)
    }
  }, [])

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      setAspectRatio(naturalWidth / naturalHeight)
    }
  }, [])

  const limitMinSize = (width: number, height: number) => {
    const minSize = 200
    return {
      width: Math.max(width, minSize),
      height: Math.max(height, minSize),
    }
  }

  const startResize = useCallback(
    (startX: number, image: HTMLImageElement, direction: 'left' | 'right') => {
      const startWidth = image.clientWidth

      const updateSize = (newWidth: number) => {
        const newHeight = newWidth / aspectRatio
        const { width, height } = limitMinSize(newWidth, newHeight)

        requestAnimationFrame(() => {
          props.updateAttributes({ width, height })
        })
      }

      const onPointerMove = (moveX: number) => {
        let diffX = startX - moveX
        if (direction === 'right') diffX = moveX - startX

        const newWidth = startWidth + diffX
        updateSize(Math.min(newWidth, proseMirrorContainerWidth))
      }

      const stopResize = () => {
        document.removeEventListener('mousemove', onMouseMoveWrapper)
        document.removeEventListener('mouseup', stopResize)
        document.removeEventListener('touchmove', onTouchMoveWrapper)
        document.removeEventListener('touchend', stopResize)
      }

      const onMouseMoveWrapper = (event: MouseEvent) => {
        event.preventDefault()
        onPointerMove(event.pageX)
      }

      const onTouchMoveWrapper = (event: TouchEvent) => {
        event.preventDefault()
        if (event.touches && event.touches[0]) {
          onPointerMove(event.touches[0].pageX)
        }
      }

      document.addEventListener('mousemove', onMouseMoveWrapper)
      document.addEventListener('mouseup', stopResize)
      document.addEventListener('touchmove', onTouchMoveWrapper, {
        passive: false,
      })
      document.addEventListener('touchend', stopResize, { passive: false })
    },
    [aspectRatio, proseMirrorContainerWidth, props]
  )

  const handlePointerDown = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>,
      direction: 'left' | 'right'
    ) => {
      const image = imageRef.current

      // Get initial pointer X position
      const startX =
        event.type === 'mousedown'
          ? (event as React.MouseEvent).pageX
          : (event as React.TouchEvent).touches[0].pageX

      if (image) startResize(startX, image, direction)
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
          onMouseDown={(e) => handlePointerDown(e, 'left')}
          onTouchStart={(e) => handlePointerDown(e, 'left')}
        >
          <Resize />
        </div>
        <div
          className='resize-trigger right'
          onMouseDown={(e) => handlePointerDown(e, 'right')}
          onTouchStart={(e) => handlePointerDown(e, 'right')}
        >
          <Resize />
        </div>
        <img
          {...props.node.attrs}
          ref={imageRef}
          className='postimage'
          onLoad={handleImageLoad}
        />
      </div>
    </NodeViewWrapper>
  )
}
