'use client'
import { useEffect, useId, useRef, useState } from "react";
import Image from 'next/image'
import gsap from "gsap";

interface MediaListProps {
  mediaList: Media[]
}

//import LeftArrowImg from '/chevron-left.svg'
//import RightArrowImg from '/chevron-right.svg'

export default function MediaSlider({mediaList}: MediaListProps) {
  const container = useRef<HTMLDivElement>(null)
  const [disableLeftArrow, setDisableLeftArrow] = useState<boolean>(true)
  const [disableRightArrow, setDisableRightArrow] = useState<boolean>(false)

  const id = useId();
  const sliderId = `slider-${id}`;

  const [index, setIndex] = useState(0)
  const slideAmount = 248
  const [startPosX, setStartPosX] = useState(0)

  useEffect(() => {
    const containerWidth = container.current?.offsetWidth
    const mediaWidth = mediaList.length * slideAmount
    setDisableLeftArrow(true)

    if (mediaList.length === 1) {
      setDisableRightArrow(true)
    }

    if (containerWidth && mediaWidth && containerWidth > mediaWidth) {
      setDisableRightArrow(true)
    }
  }, [mediaList])

  return (
    <div 
      ref={container} 
      className={`flex gap-2 overflow-hidden p-1`}
    >
      <section className={`grid place-items-center`}>
        <button 
          disabled={disableLeftArrow}
          className={`bg-purple-500 w-8 h-8 grid place-items-center 
          disabled:bg-gray-400 p-2 rounded-full hover:scale-125
          hover:bg-orange-600`}
        >
          <Image
            src='/chevron-left.svg'
            alt="left" 
            width={10}
            height={10}
          />
          
        </button>
      </section>
      <section
        id={sliderId}
        className={`flex gap-[8px] overflow-hidden`}
      >
        {
          mediaList.map((media: Media) => (
            <div key={media.url} 
              className={`shrink-0 w-[240px] cursor-pointer slide`}>
              <video 
                src={media.url}
                controls
                className={`rounded-md`}
              />
            </div>
          ))
        }
      </section>
      <section className={`grid place-items-center`}>
        <button 
          disabled={disableRightArrow}
          className={`bg-purple-500 w-8 h-8 grid place-items-center disabled:bg-gray-400
          p-2 rounded-full hover:scale-125 hover:bg-orange-600`}
        >
          <Image
            src='/chevron-right.svg'
            alt="left" 
            width={10}
            height={10}
          />
        </button>
      </section>
    </div>
  );
}