import { createClient } from '@supabase/supabase-js'
import MediaSlider from './media-slider'

async function getRandomPhrase() {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseKey = process.env.SUPABASE_KEY as string
  const supabaseClient = createClient(supabaseUrl, supabaseKey)
  const { data: idList } = await supabaseClient
  .from('phrase')
  .select("id")
  
  let randomRowId = 1
  if (idList?.length) {
    randomRowId = Math.floor(Math.random()* idList.length)
    randomRowId = idList[randomRowId].id
  }
  const { data: phrase } = await supabaseClient
    .from('phrase')
    .select("name, meanings")
    .eq('id', randomRowId)
    .single()
  
  return phrase
}

export default async function RandomWord() {
  const phrase = await getRandomPhrase()
 
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr]">
      <section 
        className={`grid place-items-center bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl
        rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none`}
      >
        <p className="text-2xl text-white font-semibold p-2">
          { phrase?.name}
        </p>
      </section>
      <section className={`bg-gray-100 shadow-2xl rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none`}>
        {
          phrase?.meanings?.map((meaning: Meaning, index: number) => (
            <section 
              key={index} 
              className={`py-2 px-4 flex flex-col gap-2 text-[#1d2a57]`}
            >
              <p className={`text-xl font-semibold italic`}>
                { index + 1 }.  { meaning.name }
              </p>
              {
                meaning.examples?.map((example: string, index: number) => (
                  <p 
                    key={example}
                    className={`pl-4 text-md font-medium`}
                  >
                    { index+1 }. { example }
                  </p>
                ))
              }
              {
                (meaning.media !== undefined && meaning.media.length > 0)  && (
                  <MediaSlider mediaList={meaning.media} />
                )
              }
            </section>
          ))
        }
      </section>
    </section>
  )
}