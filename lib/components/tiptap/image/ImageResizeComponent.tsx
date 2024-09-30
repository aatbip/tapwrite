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

  const [maxWidth, setMaxWidth] = useState<number>(0) // Dynamically calculate max width
  const [maxHeight, setMaxHeight] = useState<number>(0) // Dynamically calculate max width

  // Dynamically update the max width based on the container size

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      const proseMirrorContainerDiv = document.querySelector('.ProseMirror')
      if (proseMirrorContainerDiv) {
        setMaxWidth(proseMirrorContainerDiv.clientWidth - 20)
        setMaxHeight(
          (proseMirrorContainerDiv.clientWidth - 20) /
            (naturalWidth / naturalHeight)
        )
      }
      setAspectRatio(naturalWidth / naturalHeight)
    }
  }, [])

  const handleResize = useCallback(() => {
    handleImageLoad()
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
    const newHeight = newWidth / aspectRatio // Maintain aspect ratio
    setSize({
      width: newWidth,
      height: newHeight,
    })
  }

  const onResizeStop = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = newWidth / aspectRatio
    props.updateAttributes({
      width: newWidth,
      height: newHeight,
    })
  }

  return (
    <NodeViewWrapper className='image-resizer'>
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
            outline: props.selected ? '3px solid #0C41BB' : 'none',
            borderRadius: '5px',
            width: props.node.attrs.width,
            height: props.node.attrs.height,
          }}
          onResizeStop={onResizeStop}
          lockAspectRatio={aspectRatio}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
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
            onLoad={() => {
              handleImageLoad()
              imageRef.current &&
                setSize({
                  width: imageRef.current.naturalWidth,
                  height: imageRef.current.naturalHeight,
                })
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '5px',
            }}
          />
        </Resizable>
      </div>
    </NodeViewWrapper>
  )
}
