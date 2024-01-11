import { MouseEvent } from 'react'
import { ModalProps } from './types'

import Image from 'next/image'

// モーダルウィンドウ
const Modal = ({ isOpen, closeModal, modalData }: ModalProps) => {
  // オープンチェック
  if (!isOpen) return null

  // 背景クリック
  const handleBackgroundClick = (e: MouseEvent) => {
    //親要素へのイベントの伝搬をやめる。
    e.stopPropagation()
    // 閉じる
    closeModal()
  }

  // モーダルクリック
  const handleModalClick = (e: MouseEvent) => {
    //親要素でのonclickを封じる。
    e.stopPropagation()
  }

  return (
    <div
      className="fixed z-50 inset-2  overflow-y-auto flex items-center"
      onClick={handleBackgroundClick}
    >
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>      <div
        className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-all my-5 ${modalData.width > 512 ? 'max-w-screen-xl' : 'max-w-screen-md'
          }`}
        onClick={handleModalClick}
      >
        <div className="p-4 grid grid-cols-3 gap-4 relative">
          <div className="absolute top-1 right-1 cursor-pointer" onClick={closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-sky-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

          </div>
          <div className="col-span-2 flex justify-center">
            <Image
              src={modalData.imageSrc}
              className="rounded-lg max-h-screen object-contain"
              alt="image"
              width={modalData.width}
              height={modalData.height}
            />
          </div>
          <div className="col-span-1">
            <div className="mb-5">
              <div className="font-bold text-sm mb-1">Prompt</div>
              <div>{modalData.prompt}</div>
            </div>

            <div className="mb-5">
              <div className="font-bold text-sm mb-1">Negative Prompt</div>
              <div>{modalData.negative}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-bold text-sm mb-1">Ratio</div>
                <div>{modalData.ratio}</div>
              </div>
              <div>
                <div className="font-bold text-sm mb-1">Size</div>
                <div>
                  {modalData.width} x {modalData.height}
                </div>
              </div>
              <div>
                <div className="font-bold text-sm mb-1">Seed</div>
                <div>{modalData.seed}</div>
              </div>
              <div>
                <div className="font-bold text-sm mb-1">Steps</div>
                <div>{modalData.steps}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal