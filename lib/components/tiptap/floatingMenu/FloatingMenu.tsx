import * as React from 'react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  H1Icon,
  H2Icon,
  H3Icon,
  TextIcon,
  NumberedListIcon,
  BulletListIcon,
  UploadIcon2,
  CalloutIcon,
  TableIcon,
} from './../../../icons'
import { useAppState } from '../../../context/useAppState'
import { ImagePickerUtils } from '../../../utils/imagePickerUtils'
import { TiptapEditorUtils } from '../../../utils/tiptapEditorUtils'
import { Editor } from '@tiptap/react'

const FloatingContainerBtn = ({
  handleClick,
  label,
  focus,
}: {
  handleClick: () => void
  label: string
  focus: boolean
}) => {
  const appState = useAppState()
  if (label === 'Upload' && !appState?.uploadFn) {
    return null
  }
  return (
    <button
      className={`flex flex-row gap-x-2.5 items-center py-1.5 px-3 cursor-pointer outline-none ${
        focus && 'bg-new-white-2'
      } display-block`}
      onClick={() => {
        handleClick()
      }}
    >
      <div>
        {label === 'Heading 1' ? (
          <H1Icon />
        ) : label === 'Heading 2' ? (
          <H2Icon />
        ) : label === 'Heading 3' ? (
          <H3Icon />
        ) : label === 'Text' ? (
          <TextIcon />
        ) : label === 'Bullet List' ? (
          <BulletListIcon />
        ) : label === 'Numbered List' ? (
          <NumberedListIcon />
        ) : label === 'Upload' ? (
          <UploadIcon2 />
        ) : label === 'Table' ? (
          <TableIcon />
        ) : label === 'Callout' ? (
          <CalloutIcon />
        ) : (
          <></>
        )}
      </div>
      <div>
        <p className='text-sm'>{label}</p>
      </div>
    </button>
  )
}

export const FloatingMenu = forwardRef((props: any, ref: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const appState = useAppState()

  async function handleFileUpload() {
    const tiptapEditorUtils = new TiptapEditorUtils(appState?.editor as Editor)
    const imagePickerUtils = new ImagePickerUtils()
    const file = await imagePickerUtils.selectImageFromLocalDrive()
    const uniqueId = `image--${Math.random().toString(36).substring(2, 11)}`

    if (file) {
      const filetoUpload = new File([file], `${uniqueId}${file.name}`, {
        type: file.type,
        lastModified: file.lastModified,
      })
      const fn = appState?.uploadFn
      if (fn) {
        // const imgUtil = new ImagePickerUtils()
        // const url = await imgUtil.imageUrl(file)
        // tiptapEditorUtils.setImage(url || '', 'loading') //used to show image for loading state before actual url is uploaded through the asynchronous function appState?.uploadFn
        fn(filetoUpload, tiptapEditorUtils)
      }
    }
  }

  const selectItem = (index: any) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
      if (item.title === 'Upload') {
        handleFileUpload()
      }
    }
  }

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    )
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  const { items } = props

  return (
    <div className='flex flex-col gap-0.5 bg-white py-2 border border-new-card-border rounded shadow-vairant-1 w-48 overflow-hidden relative'>
      {items && items?.length ? (
        items.map((item: any, index: any) => (
          <FloatingContainerBtn
            key={index}
            handleClick={() => {
              selectItem(index)
            }}
            label={item.title}
            focus={index === selectedIndex}
          />
        ))
      ) : (
        <FloatingContainerBtn
          label={'No Options'}
          handleClick={() => {}}
          focus={false}
        />
      )}
    </div>
  )
})

FloatingMenu.displayName = 'FloatingMenu'
