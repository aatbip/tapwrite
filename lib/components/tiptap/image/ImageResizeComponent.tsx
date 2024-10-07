import React, { useState, useCallback, useRef, useEffect } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'
import { LoadingPlaceholder } from './loadingPlaceholder'
import { Resize } from './resizeIcon'

export const ImageResizeComponent = (props: any) => {
  const { editor } = props
  const editable = editor.isEditable
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState({
    width: props.node.attrs.width,
    height: props.node.attrs.height,
  })
  const [aspectRatio, setAspectRatio] = useState(1)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLImageElement | null>(null)

  const [maxWidth, setMaxWidth] = useState<number>(0) // Dynamically calculate max width
  const [maxHeight, setMaxHeight] = useState<number>(0) // Dynamically calculate max width

  // Dynamically update the max width based on the container size

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      const proseMirrorContainerDiv =
        document.querySelector('.node-uploadImage')
      if (proseMirrorContainerDiv) {
        setMaxWidth(proseMirrorContainerDiv.clientWidth)

        setMaxHeight(
          proseMirrorContainerDiv.clientWidth / (naturalWidth / naturalHeight)
        )

        if (typeof props.node.attrs.width !== 'number') {
          props.updateAttributes({
            width: naturalWidth,
          })
        }
        if (typeof props.node.attrs.height !== 'number') {
          props.updateAttributes({
            height: naturalHeight,
          })
        }
        if (naturalWidth < 40) {
          props.updateAttributes({
            width: 40,
          })
          props.updateAttributes({
            height: 40 / aspectRatio,
          })
        }
      }
      setAspectRatio(naturalWidth / naturalHeight)
    }
  }, [])

  const handleResize = useCallback(() => {
    handleImageLoad()
  }, [handleImageLoad])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      handleImageLoad()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [handleImageLoad])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    setSize({
      width: props.node.attrs.width,
      height: props.node.attrs.height,
    })
  }, [props.node.attrs.width, props.node.attrs.height])

  const onResize = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = newWidth / aspectRatio
    setSize({
      width: newWidth,
      height: newHeight,
    })
  }

  const onResizeStop = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = newWidth / aspectRatio

    const widthDiff = newWidth >= maxWidth - 5 ? newWidth - (maxWidth - 5) : 0
    const heightDiff =
      newHeight >= maxHeight - 5 ? newHeight - (maxHeight - 5) : 0
    props.updateAttributes({
      width: widthDiff > 0 ? 650 : newWidth,
      height: heightDiff > 0 ? 650 / aspectRatio : newHeight,
    })
  }

  return (
    <NodeViewWrapper className='image-resizer' ref={containerRef}>
      {loading && (
        <LoadingPlaceholder
          width={props.node.attrs.width as number}
          height={props.node.attrs.height as number}
        />
      )}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <Resizable
          size={size}
          onResize={onResize}
          style={{
            borderRadius: '5px',
            width: props.node.attrs.width,
            height: props.node.attrs.height,
          }}
          onResizeStop={onResizeStop}
          lockAspectRatio={aspectRatio}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          minHeight={40}
          minWidth={40}
          enable={
            editable
              ? {
                  top: false,
                  right: true,
                  bottom: false,
                  left: true,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }
              : false
          }
          handleComponent={{
            left: editable && (
              <div
                className='resize-trigger left'
                style={{ cursor: 'ew-resize', width: '10px', height: '25%' }}
              >
                <Resize />
              </div>
            ),
            right: editable && (
              <div
                className='resize-trigger right'
                style={{ cursor: 'ew-resize', width: '10px', height: '25%' }}
              >
                <Resize />
              </div>
            ),
          }}
        >
          <img
            {...props.node.attrs}
            ref={imageRef}
            className='postimage'
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '5px',
              outline: props.selected ? '3px solid #0C41BB' : 'none',
              outlineOffset: '-3px',
            }}
          />
        </Resizable>
      </div>
    </NodeViewWrapper>
  )
}
