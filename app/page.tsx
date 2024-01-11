import Link from "next/link";

export default function Home() {
  return (
    <div className=' mx-4 text-center flex flex-col justify-evenly gap-4 min-h-[100svh] '>
      <p className='text-2xl bg-orange-200'>PicAI</p>
      <p className='text-2xl bg-sky-200'>うおおお</p>
      <Link href={"/mainpage"} className='text-4xl font-bold bg-sky-400 w-3/5 p-2 rounded-xl mx-auto'>Generate</Link>
    </div>
  )
}
