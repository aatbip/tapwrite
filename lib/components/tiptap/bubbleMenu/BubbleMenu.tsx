import * as React from 'react'
import { Editor } from '@tiptap/react'
import { FC, ReactNode } from 'react'

import {
  BulletListIcon2,
  DollarIcon,
  NumberedListIcon2,
} from './../../../icons'

import DropdownBubbleMenu from './DropdownBubbleMenu'
import { TiptapEditorUtils } from './../../../utils/tiptapEditorUtils'

interface IBubbleMenuContainer {
  editor: Editor
}

const BubbleMenuContainer: FC<IBubbleMenuContainer> = ({ editor }) => {
  const tiptapEditorUtils = new TiptapEditorUtils(editor)

  return (
    <div className='flex flex-row border border-slate-300 rounded bg-white w-fit shadow-variant-1'>
      <DropdownBubbleMenu editor={editor} />

      <BubbleMenuBtnContainer
        icon={'B'}
        handleOnClick={() => {
          tiptapEditorUtils.toggleBold()
        }}
        className='border-r-2'
      />

      <BubbleMenuBtnContainer
        icon={'i'}
        handleOnClick={() => {
          tiptapEditorUtils.toggleItalic()
        }}
        className='border-r-2'
      />

      <BubbleMenuBtnContainer
        icon={'U'}
        handleOnClick={() => {
          tiptapEditorUtils.toggleUnderline()
        }}
        className='border-r-2'
      />

      <BubbleMenuBtnContainer
        icon={<DollarIcon />}
        handleOnClick={() => {
          tiptapEditorUtils.toggleStrike()
        }}
        className={'pt-4 border-r-2'}
      />

      <BubbleMenuBtnContainer
        icon={<BulletListIcon2 />}
        handleOnClick={() => {
          tiptapEditorUtils.toggleBulletList()
        }}
        className={'pt-4 border-r-2'}
      />

      <BubbleMenuBtnContainer
        icon={<NumberedListIcon2 />}
        handleOnClick={() => {
          tiptapEditorUtils.toggleNumberedList()
        }}
        className={'pt-4 border-r-2'}
      />

      {/* <BubbleMenuBtnContainer */}
      {/*   icon={<LinkIcon2 />} */}
      {/*   handleOnClick={() => { */}
      {/*     appState?.toggleShowLinkInput(!appState?.appState.showLinkInput) */}
      {/*   }} */}
      {/*   className={'pt-4 rounded-r'} */}
      {/* /> */}
    </div>
  )
}

export default BubbleMenuContainer

const BubbleMenuBtnContainer = ({
  icon,
  handleOnClick,
  className,
}: {
  icon: ReactNode
  handleOnClick: () => void
  className?: string
}) => {
  return (
    <button
      className={`flex flex-row py-3 px-4 bg-white align-center ${className}`}
      onClick={() => handleOnClick()}
    >
      <div>{icon}</div>
    </button>
  )
}
