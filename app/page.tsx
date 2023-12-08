import BrowseWords from './components/browse/browse-words'
import RandomWord from './components/random-word'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <div className="flex h-12 shadow-lg shadow-gray-500 w-max">
        <div className="h-12 w-12 bg-yellow-400" />
        <p className="text-2xl text-white font:base sm:font-lg bg-[#1d2a57] w-max p-2 px-4">
          Phrase of the Moment
        </p>
      </div>
      <RandomWord />
      <BrowseWords />
    </>
  )
}
