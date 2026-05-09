"use client";

/* slider items 12 */

const items = [
  {
    id: 1,
    title: "Item 1",
    description: "This is the first item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+1",
  },
  {
    id: 2,
    title: "Item 2",
    description: "This is the second item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+2",
  },
  {
    id: 3,
    title: "Item 3",
    description: "This is the third item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+3",
  },
  {
    id: 4,
    title: "Item 4",
    description: "This is the fourth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+4",
  },
  {
    id: 5,
    title: "Item 5",
    description: "This is the fifth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+5",
  },
  {
    id: 6,
    title: "Item 6",
    description: "This is the sixth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+6",
  },
  {
    id: 7,
    title: "Item 7",
    description: "This is the seventh item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+7",
  },
  {
    id: 8,
    title: "Item 8",
    description: "This is the eighth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+8",
  },
  {
    id: 9,
    title: "Item 9",
    description: "This is the ninth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+9",
  },
  {
    id: 10,
    title: "Item 10",
    description: "This is the tenth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+10",
  },
  {
    id: 11,
    title: "Item 11",
    description: "This is the eleventh item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+11",
  },
  {
    id: 12,
    title: "Item 12",
    description: "This is the twelfth item.",
    imageUrl: "https://via.placeholder.com/300x200?text=Item+12",
  },
];

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SlideCustom {
  width: number;
  isNext: boolean;
}

const rowVariants = {
  hidden: ({ width, isNext }: SlideCustom) => ({
    x: isNext ? width : -width,
  }),
  visible: {
    x: 0,
  },
  exit: ({ width, isNext }: SlideCustom) => ({
    x: isNext ? -width : width,
  }),
};

export default function TestPage() {
  const offset = 4;
  const [pageIndex, setPageIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [isNext, setIsNext] = useState(true);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const increaseIndex = () => {
    const totalPages = Math.ceil(items.length / offset);
    setIsNext(true);
    setPageIndex((prev) => (prev + 1) % totalPages);
  };

  const decreaseIndex = () => {
    const totalPages = Math.ceil(items.length / offset);
    setIsNext(false);
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Test Page</h1>

      <motion.div className="relative">
        <AnimatePresence mode="wait" custom={{ width, isNext }}>
          <motion.div
            className="absolute mt-15 grid w-full grid-cols-4 gap-2"
            key={pageIndex}
            variants={rowVariants}
            custom={{ width, isNext }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.25 }}
          >
            {items
              .slice(pageIndex * offset, pageIndex * offset + offset)
              .map((item) => (
                <div
                  key={item.id}
                  className="group relative flex cursor-pointer flex-col gap-1 rounded-md"
                >
                  <div className="overflow-hidden rounded-md">
                    <Image
                      width={320}
                      height={160}
                      src={
                        "https://image.tmdb.org/t/p/w500_and_h282_face/oWsXOGmmR9BZTeWcIXa6ge8iGjj.jpg"
                      }
                      alt={`${item.title}-backdrop`}
                      className="w-full transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-0 z-50 w-full p-2 text-shadow-current">
                    <span className="text-sm font-semibold">{item.title}</span>
                    <div className="flex justify-between">
                      {/* {item.seasonName && item.episodeNumber && (
                        <span className="text-xs opacity-70">
                          {item.seasonName} {item.episodeNumber}화
                        </span>
                      )}

                      {item.updatedAt && (
                        <span className="text-xs opacity-70">
                          {timeAgo(item.updatedAt)} 업데이트
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="absolute bottom-0 flex h-full w-full items-end bg-gradient-to-t from-black/90 via-transparent to-transparent blur-xl" />
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2 p-5">
          <button
            onClick={decreaseIndex}
            className="cursor-pointer rounded-md border p-2"
          >
            prev
          </button>
          <button
            onClick={increaseIndex}
            className="cursor-pointer rounded-md border p-2"
          >
            next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
