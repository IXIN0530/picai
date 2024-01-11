'use client'

import { useRef, useState } from 'react'
import { CreateType } from './types'
import Slider from 'rc-slider'
//zipファイルを解凍できるようにする
import JSZip from 'jszip'
import 'rc-slider/assets/index.css'

// 画像サイズ
const SIZE_OPTIONS = [
  { ratio: '7:4', width: 896, height: 512 },
  { ratio: '3:2', width: 768, height: 512 },
  { ratio: '5:4', width: 640, height: 512 },
  { ratio: '1:1', width: 512, height: 512 },
  { ratio: '4:5', width: 512, height: 640 },
  { ratio: '2:3', width: 512, height: 768 },
  { ratio: '4:7', width: 512, height: 896 },
]

// 画像生成最大数
const MAX_IMAGE_COUNT = 4

// 画像生成フォーム
const Create = ({ loading, setLoading, setImages }: CreateType) => {
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const negativeRef = useRef<HTMLTextAreaElement>(null)
  const scaleRef = useRef<HTMLInputElement>(null)
  const stepsRef = useRef<HTMLInputElement>(null)
  const seedRef = useRef<HTMLInputElement>(null)
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[3])
  const [size, setSize] = useState(3)
  const [count, setCount] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // 画像生成数変更
  const countHandleChange = (value: number | number[]) => {
    const numValue = value as number
    setCount(numValue)
  }

  // 画像サイズ変更
  const sizeHandleChange = (value: number | number[]) => {
    const numValue = value as number
    setSize(numValue)
    setSelectedSize(SIZE_OPTIONS[numValue])
  }

  // 画像生成
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ローディング開始
    setLoading(true)
    // エラーメッセージクリア
    setError('')

    // フォームデータ取得
    const prompt = promptRef.current!.value
    const negative = negativeRef.current!.value
    const width = selectedSize.width
    const height = selectedSize.height
    const ratio = selectedSize.ratio
    const scale = parseFloat(scaleRef.current!.value)
    const steps = parseInt(stepsRef.current!.value, 10)
    const seed = parseInt(seedRef.current!.value, 10)

    // シード生成
    const seedList = []
    for (let i = 0; i < count; i++) {
      if (!seed) {
        // シードが指定されていない場合は、ランダムなシードを設定
        seedList.push(Math.floor(Math.random() * 1000000000))
      } else {
        // シードが指定されている場合は、指定されたシードを設定
        seedList.push(seed)
      }
    }

    try {
      const body = {
        prompt,
        negative,
        count,
        width,
        height,
        scale,
        steps,
        seedList,
      }
      //画像生成APIの呼び出し
      const response = await fetch("http://localhost:8000/api/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      //画像生成APIエラー
      if (!response.ok) {
        const errorData = await response.json();
        setError('画像が生成できませんでした:' + { errorData })
        setLoading(true)
        return
      }

      //画像呼び出しAPI成功
      const zipBlob = await response.blob()
      //Zipファイルを解凍
      const zipArrayBuffer = await zipBlob.arrayBuffer()
      //zipファイルを読み込み
      const zip = await JSZip.loadAsync(zipArrayBuffer)

      //画像データを作成
      const imageDataList = []
      //zipファイル内の画像を取得
      for (const [index, fileName] of Object.entries(Object.keys(zip.files))) {
        //画像ファイルを取得
        const imageFile = zip.file(fileName)
        //画像ファイルをblobに変換
        const imageData = await imageFile!.async("blob")
        //blobをURLに変換
        const imageObjectURL = URL.createObjectURL(imageData)

        //画像データを生成
        imageDataList.push({
          imageSrc: imageObjectURL,
          prompt,
          negative,
          ratio,
          width,
          height,
          seed: seedList[parseInt(index, 10)],
          steps,
        })
      }

      //画像データをセット
      setImages(imageDataList)
    } catch (error) {

      alert(error);
    }

    setLoading(false)
  }

  //informationが選択されているか
  const [isSelectedP, setIsSelectedP] = useState(false)
  const [isSelectedNp, setIsSelectedNp] = useState(false)
  const [isSelectedIc, setIsSelectedIc] = useState(false)
  const [isSelectedGs, setIsSelectedGs] = useState(false)
  const [isSelectedNi, setIsSelectedNi] = useState(false)
  return (
    <>
      <div className="border-b-2 border-sky-200 mb-4 font-bold text-xl text-center pt-4 ">FreePictureGenerate</div>

      <form onSubmit={onSubmit} className=''>
        {/* プロンプト */}
        <div className="p-4 rounded-lg bg-sky-100 shadow">
          <div className="mb-5">
            <div className='flex gap-1  justify-between' onMouseEnter={() => setIsSelectedP(true)} onMouseLeave={() => setIsSelectedP(false)}>
              {!isSelectedP ? <div className="font-bold mb-2 text-sm overflow-hidden">Prompt</div> : false}
              {isSelectedP ? <div className=" font-bold mb-2 text-sm overflow-hidden">画像に含める</div> : false}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none bg-gray-50 focus:bg-white"
              rows={3}
              ref={promptRef}
              id="prompt"
              required
            />
          </div>

          {/* ネガティブプロンプト */}
          <div className="mb-5">
            <div className='flex gap-1 justify-between' onMouseEnter={() => setIsSelectedNp(true)} onMouseLeave={() => setIsSelectedNp(false)}>
              {!isSelectedNp ? <div className="font-bold mb-2 text-sm overflow-hidden">Negative Prompt</div> : false}
              {isSelectedNp ? <div className=" font-bold mb-2 text-sm overflow-hidden ">画像に含めない</div> : false}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none bg-gray-50 focus:bg-white"
              rows={3}
              ref={negativeRef}
              id="negative"
            />
          </div>

          {/* 画像生成数 */}
          <div className="mb-5">
            <div className='flex gap-1  justify-between' onMouseEnter={() => setIsSelectedIc(true)} onMouseLeave={() => setIsSelectedIc(false)}>
              {!isSelectedIc ? <div className="font-bold mb-2 text-sm overflow-hidden">Image Count</div> : false}
              {isSelectedIc ? <div className=" font-bold mb-2 text-sm overflow-hidden ">生成する画像数</div> : false}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="px-2">
              <Slider
                min={1}
                max={MAX_IMAGE_COUNT}
                value={count}
                onChange={countHandleChange}
                trackStyle={{ backgroundColor: 'rgba(29, 78, 216)', height: 4 }}
                handleStyle={{
                  borderColor: 'rgba(29, 78, 216)',
                  borderWidth: 2,
                  backgroundColor: 'rgba(29, 78, 216)',
                  width: 16,
                  height: 16,
                }}
                railStyle={{ backgroundColor: 'rgba(219, 234, 254)', height: 4 }}
              />
            </div>

            <div className="flex justify-between mt-2 text-sm">
              {Array.from({ length: MAX_IMAGE_COUNT }, (_, i) => i + 1).map((data, index) => (
                <div key={index}>{data}</div>
              ))}
            </div>
          </div>

          {/* 画像生成サイズ */}
          <div className="mb-5">
            <div className="flex justify-between">
              <div className="font-bold mb-2 text-sm">Size</div>
              <div className="text-sm">
                {selectedSize.width} x {selectedSize.height}
              </div>
            </div>
            <div className="px-2">
              <Slider
                min={0}
                max={SIZE_OPTIONS.length - 1}
                value={size}
                onChange={sizeHandleChange}
                trackStyle={{ backgroundColor: 'rgba(29, 78, 216)', height: 4 }}
                handleStyle={{
                  borderColor: 'rgba(29, 78, 216)',
                  borderWidth: 2,
                  backgroundColor: 'rgba(29, 78, 216)',
                  width: 16,
                  height: 16,
                }}
                railStyle={{ backgroundColor: 'rgba(219, 234, 254)', height: 4 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              {SIZE_OPTIONS.map((data, index) => (
                <div key={index}>{data.ratio}</div>
              ))}
            </div>
          </div>

          {/* 画像がプロンプトにどれだけ従うか */}
          <div className="mb-5">
            <div className='flex gap-1  justify-between' onMouseEnter={() => setIsSelectedGs(true)} onMouseLeave={() => setIsSelectedGs(false)}>
              {!isSelectedGs ? <div className="font-bold mb-2 text-sm overflow-hidden">Guidance Scale</div> : false}
              {isSelectedGs ? <div className=" font-bold mb-2 text-sm overflow-hidden ">画像がプロンプトにどれだけ従うか(5~10が一般的)</div> : false}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <input
              className="w-full border rounded-lg p-2 focus:outline-none bg-gray-50 focus:bg-white text-center"
              type="number"
              step={0.5}
              ref={scaleRef}
              id="scale"
              defaultValue={7.5}
              required
            />
          </div>

          {/* ステップ数 */}
          <div className="mb-5">
            <div className='flex gap-1  justify-between' onMouseEnter={() => setIsSelectedNi(true)} onMouseLeave={() => setIsSelectedNi(false)}>
              {!isSelectedNi ? <div className="font-bold mb-2 text-sm overflow-hidden">Number of Interface Steps</div> : false}
              {isSelectedNi ? <div className=" font-bold mb-2 text-sm overflow-hidden ">改良回数</div> : false}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <input
              className="w-full border rounded-lg p-2 focus:outline-none bg-gray-50 focus:bg-white text-center"
              type="number"
              ref={stepsRef}
              id="steps"
              defaultValue={30}
              required
            />
          </div>

          {/* シード */}
          <div className="mb-5">
            <div className="font-bold mb-2 text-sm">Seed</div>
            <input
              className="w-full border rounded-lg p-2 focus:outline-none bg-gray-50 focus:bg-white text-center"
              type="number"
              ref={seedRef}
              id="seed"
            />
          </div>

          {/* エラーメッセージ */}
          {error && <div className="text-red-500 text-center mb-5">{error}</div>}

          {/* ボタン */}
          <div>
            <button
              type="submit"
              className="w-full text-white bg-sky-400 hover:bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
              disabled={loading}
            >
              <div className="flex items-center justify-center space-x-3">
                {loading && (
                  <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                )}
                <div>Generate</div>
              </div>
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Create