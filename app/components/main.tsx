"use client"

import { useState } from "react";
import { imagesType } from "./types";
import Generate from "./generate";
import Create from "./create";
import Modal from "./modal";

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<imagesType[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<imagesType | null>(null)

  const closeModal = () => {
    setModalOpen(false);
  }

  return (
    <div className="grid grid-cols-5 gap-4 mx-4">
      {/* モーダル */}
      {modalData && <Modal isOpen={modalOpen} closeModal={closeModal} modalData={modalData} />}
      <div className=" col-span-2">
        {/* 画像生成フォーム */}
        <Create loading={loading} setLoading={setLoading} setImages={setImages} />
      </div>

      <div className=" col-span-3">
        {/* 画像表示*/}
        <Generate
          loading={loading}
          images={images}
          setModalData={setModalData}
          setModalOpen={setModalOpen} />
      </div>
    </div>
  )
}

export default Main;