"use client"
import { GenerateType, imagesType } from "./types"
import { motion } from "framer-motion"
import Image from "next/image"
const Generate = ({ loading, images, setModalOpen, setModalData }: GenerateType) => {

  const openModal = (data: imagesType) => {
    setModalData(data);
    setModalOpen(true);
  }

  return (
    <>
      <div className="border-b-2 border-sky-200 mb-4 pt-4 text-center font-bold text-xl">Generation</div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
        </div>
      ) : images ? (
        <div className="grid grid-cols-2 gap-1">
          {images.map((data, index) => (
            <div key={index} className="cursor-pointer" onClick={() => openModal(data)}>
              <Image
                src={data.imageSrc}
                className="object-cover rounded-lg"
                alt="image"
                width={740}
                height={740}
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Generate;