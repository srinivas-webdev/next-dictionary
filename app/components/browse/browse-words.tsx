'use client'

import { useParams, useRouter } from 'next/navigation'
import styles from './browse-words.module.css'

const alphabets: string[] = [...Array(26)].map((_, y) => String.fromCharCode(y + 97))
const getCustomStyles = (ch: string, alphabetParam: string | undefined) => {
  let customStyle = "";
  if (alphabetParam?.length) {
    customStyle = " text-black "
    if (alphabetParam == ch) {
      customStyle += " bg-sky-400 "
    } else {
      customStyle += " bg-white "
    }
  }

  return customStyle     
}

export default function Browse() {
  const params = useParams()
  const router = useRouter()
  return (
    <section 
      className={`p-2 pl-8 flex flex-col gap-2  text-white 
      rounded-md custom-shadow 
      ${styles.shadow}
      ${params['alphabet']?.length ===1 ? 'bg-gray-200 text-black' : 'bg-gradient-to-br from-indigo-900 to-rose-900'}`}
    >
      {!params['alphabet'] && (
        <h1 
          className="text-xl font-lg"
        >
          Browse English Phrases 
        </h1>
      )}
    
      <menu className={`${styles.container} py-4`}>
      {alphabets.map((alphabet) => (
          <button 
            key={alphabet}
            className={`grid place-items-center text-xl 
            font-bold rounded-full 
              bg-gray-500 w-12 p-2  shadow-md
              hover:outline hover:outline-2 
              hover:outline-offset-2 hover:outline-sky-400
              ${getCustomStyles(alphabet, params["alphabet"] as string)}`
            }
            onClick={() => router.push('/browse/' + alphabet)}
          >
            {alphabet}
          </button>
        ))}
      </menu>
    </section>
  );
}