'use client'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import styles from './header.module.css'
import { useCallback, useEffect, useRef, useState } from 'react';

type SearchResult = {
  name: string;
}

export default function Header() {
  const router = useRouter()
  
  const [showResultsMenu, setShowResultsMenu] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchInputText, setSearchInputText]  = useState('')
  const [searchBtnFocused, setSearchBtnFocused]  = useState(false)
  const [searchBtnHovered, setSearchBtnHovered]  = useState(false)
  const [fillColor, setFillColor] = useState('black')
  const [matchedPhrases, setMatchedPhrases] = useState<string[] | null>(null)
  const matchedPhrasesMenu = useRef<HTMLElement>(null)
  const [activePhraseIndex, setActivePhraseIndex] = useState(-1)
  const [originalSearchText, setOriginalSearchText] = useState('')
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    if (showResultsMenu) {
      window.addEventListener("click", onClick)
    } else {
      window.removeEventListener("click", onClick)
    }
  }, [showResultsMenu])
  
  useEffect(() => {
    searchBtnHovered || searchBtnFocused ? setFillColor('white') : setFillColor('black')
  }, [searchBtnHovered, searchBtnFocused])
 
  useEffect(() => {
    const debounced = setTimeout(() => {
      setSearchText(searchInputText)
    }, 500);
    return () => clearInterval(debounced);
  }, [searchInputText])



  useEffect(() => {
    async function getMatchingPhrases(searchText: string) {
      const res = await fetch(`/api/search?query=${searchText}`)
      const matchedResults: SearchResult[] = await res.json()
      if (matchedResults?.length) {
        setMatchedPhrases(matchedResults.map((result)  => result.name))
        setShowResultsMenu(true)
      } else {
        setShowResultsMenu(false)
        setMatchedPhrases(null)
      }
    }

    if (!searchText?.length) {
      setMatchedPhrases(null)
      setShowResultsMenu(false)
      setActivePhraseIndex(-1)
      setOriginalSearchText("")
    } else {
      // check the results are shown and no change in the search string
      // due to up and down keys
      if (
        (searchText == originalSearchText || activePhraseIndex !== -1)) {
        return
      }
      
      // save the search Input Text
      setOriginalSearchText(searchText)
      getMatchingPhrases(searchText)
    }
  }, [searchText, activePhraseIndex, originalSearchText])

  const onClickSearchInput = () => {
    if (matchedPhrases?.length && !showResultsMenu) {
      setShowResultsMenu(true)
    } else {
      setShowResultsMenu(false)
    }
  }

  const onKeyEnterSearchInput = () => {
    if (matchedPhrases?.includes(searchInputText)) {
      if (showResultsMenu) setShowResultsMenu(false)
      setMatchedPhrases([])
      router.push('/dictionary?search=' + searchInputText)
    }
  }

  const handleKeyEventOnActivePhrase = (eventType: string, event: KeyboardEvent) => {
    event.stopPropagation()
    if (!showResultsMenu) {
      return
    }
  
    if (eventType === "keydown") {
      const matchedPhrasesSize = matchedPhrases?.length
      if (matchedPhrasesSize &&
        (activePhraseIndex === matchedPhrasesSize)) {
        setActivePhraseIndex(-1)
      } else {
        setActivePhraseIndex((index) => (index+1))
      }
    } else if (eventType == "keyup") {
      if (activePhraseIndex == -1 && matchedPhrases) {
        setActivePhraseIndex(matchedPhrases.length - 1)
      } else {
        setActivePhraseIndex((index) => (index-1))
      }
    }
    
    if (activePhraseIndex == -1) {
      setSearchInputText(originalSearchText)
    } else {
      if (matchedPhrases) {
        setSearchInputText(matchedPhrases[activePhraseIndex])
      }
    }
  }

  const onKeyDown = (event: any) => {
   
    switch (event.key) {
      case "ArrowDown":
        handleKeyEventOnActivePhrase("keydown", event)
        break;
      case "ArrowUp":
        handleKeyEventOnActivePhrase("keyup", event)
        break;
      case "Enter":
        onKeyEnterSearchInput()
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }

  const onClick = (e: MouseEvent) => {
    const matchedPhrasesMenuDimentions: DOMRect | undefined = matchedPhrasesMenu.current?.getBoundingClientRect()
    let isClickOutsidePhrasesMenu = false;
    
    // if the click is outside the displayed phrases list container
    if ( matchedPhrasesMenuDimentions && (
      e.clientX < matchedPhrasesMenuDimentions!.left ||
      e.clientX > matchedPhrasesMenuDimentions!.right ||
      e.clientY < matchedPhrasesMenuDimentions!.top ||
      e.clientY > matchedPhrasesMenuDimentions!.bottom)
    ) {
      isClickOutsidePhrasesMenu = true
    }
  
    // if the click is inside search input box
    const searchInputTextDimentions: DOMRect | undefined = searchInputRef.current?.getBoundingClientRect()
    let isClickInsideSeachInput = true
    if ( 
      e.clientX < searchInputTextDimentions!.left ||
      e.clientX > searchInputTextDimentions!.right ||
      e.clientY < searchInputTextDimentions!.top ||
      e.clientY > searchInputTextDimentions!.bottom
    ) {
      isClickInsideSeachInput = false
    }
  
    if (isClickOutsidePhrasesMenu) {
      if (isClickInsideSeachInput) {
        setShowResultsMenu(true)
      } else {
        setShowResultsMenu(false)
      }
    }
  }

  const handleMouseEventOnActivePhrase = (index: number, eventType: string) => {
    if (eventType == "mouseenter") {
      setActivePhraseIndex(index)
    }
  }
  

  return (
    <header className={`flex flex-col gap-1 p-1 py-2 sm:flex-row ${styles.header}`}>
      <section className={`flex items-center gap-2 mr-4`}>
        <picture 
          className={`cursor-pointer`} 
          title="Click to home"
          onClick={() => router.push('/')}
        >
          <Image
            src="/favicon.ico"
            alt="logo" 
            width="30" 
            height="30"
          />
        </picture>
        <p className={`font-semibold text-white text-lg`}>
          Dictionary of Idioms/Phrasal Verbs
        </p>
      </section>
      <section 
        id="search-wrapper" 
        className={`flex flex-col sm:w-2/5 shadow-md 
          shadow-gray-800 hover:shadow-xl hover:shadow-gray-700
          ${showResultsMenu ? 'rounded-br-md rounded-bl-md': ''}
          `}
      >
        <section className={`flex h-10 sm:h-12`}>
          <input
            ref={searchInputRef}
            value={searchInputText}
            placeholder="Search here"
            className={`w-full rounded-tl-md outline-none pl-2
            ${!showResultsMenu ? 'rounded-bl-md': ''}`} 
            onChange={(e) => setSearchInputText(e.target.value)}
            onClick={onClickSearchInput}
            onKeyDown={onKeyDown}

          />
          {
            searchInputText?.length > 0 && (
              <section 
                className="grid items-center bg-white"
                onClick={() => setSearchInputText("")}
              >
                <button 
                  id="clear-query-button" 
                  className={`grid items-center bg-gray-300 
                  hover:bg-sky-300 p-1 mr-[1px] rounded-md`}
                  aria-label="Clear"
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 14 14" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M2.06834 13.4173C1.68757 13.7981 1.07024 13.7981 0.689477 13.4173C0.308716 13.0365 0.308716 12.4192 0.689477 12.0384L5.67424 7.05368L0.688891 2.06833C0.30813 1.68757 0.30813 1.07023 0.688891 0.68947C1.06965 0.308709 1.68699 0.308709 2.06775 0.68947L7.0531 5.67482L12.0385 0.68938C12.4193 0.308618 13.0366 0.308618 13.4174 0.689379C13.7982 1.07014 13.7982 1.68748 13.4174 2.06824L8.43196 7.05368L13.4168 12.0385C13.7976 12.4193 13.7976 13.0366 13.4168 13.4174C13.0361 13.7982 12.4187 13.7982 12.038 13.4174L7.0531 8.43254L2.06834 13.4173Z" 
                  fill="black"
                />
                  </svg>
                </button>
              </section>
            )
          }
          <section className={`h-full bg-white`}>
            <div 
              className={`relative mt-1 w-3/4 h-3/4 border-solid border-r-2 border-gray-300 pr-1`}
            />
          </section>
          <section 
            id="search-query-button-wrapper" 
            tabIndex={0}
            className={`z-20 grid items-center bg-white px-4 
              rounded-tr-md cursor-pointer 
              ${!showResultsMenu ? 'rounded-br-md': ''}
              ${searchBtnFocused || searchBtnHovered ? 'bg-gradient-to-r from-yellow-500 to-pink-700': ''}
             `}
             onClick={onKeyEnterSearchInput}
             onMouseEnter={() => setSearchBtnFocused(true)}
             onMouseLeave={() => setSearchBtnFocused(false)}
          >
            <button 
              id="search-query-button" 
              aria-label="Search" 
              tabIndex={-1} 
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="17" 
                className={`icon`} 
                viewBox="0 0 18 17"
              >
                <path 
                  fill={fillColor} 
                  fillRule="evenodd" 
                  d="M1.6 7.336a5.736 5.736 0 1 1 11.471 0 5.736 5.736 0 0 1-11.471 0ZM7.336 0a7.336 7.336 0 1 0 4.957 12.743l3.56 3.561a.8.8 0 0 0 1.132-1.131l-3.636-3.636A7.336 7.336 0 0 0 7.335 0Z" 
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </section>
        </section>
        { showResultsMenu && (
          <section
            ref={matchedPhrasesMenu}
            className={`relative w-full z-10`}
          >
            <section className={`absolute flex flex-col bg-white  border-2 border-t-0 w-full rounded-b-md pb-1 shadow-2xl shadow-zinc-900/50`}>
              <section className={`flex flex-col w-full before:border-t-[1px] before:border-gray-300 before:pb-2 before:mx-2`}>
                {
                  matchedPhrases?.map((word, index) => (
                    <a 
                      key={index}
                      href={'/dictionary?search='+word}
                      className={`pl-2 cursor-pointer 
                        ${index == activePhraseIndex ? 'bg-blue-100 cursor:pointer': ''}
                      `}  
                      onClick={() => setSearchInputText(word)}
                      onMouseEnter={() => handleMouseEventOnActivePhrase(index, 'mouseenter')}
                      onMouseLeave={() => setActivePhraseIndex(-1)}
                    
                    >
                      { word }
                    </a>
                  ))
                }
              </section>
            </section>
          </section>
        )}
      </section>
      
    </header>
  )
}