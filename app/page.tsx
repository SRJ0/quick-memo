"use client"
import React, { useState } from "react";

interface Result {
    id: number;
    subject: string;
    memo: string;
    grade: number;
}
const isLocal = process.env.NODE_ENV === "development";

const getBGColor = (grade: number) => {
    if (grade === 1) return "#FFB3BA";
    if (grade === 2) return "#FFDFBA";
    if (grade === 3) return "#FFFFBA";
    if (grade === 4) return "#BAFFC9";
    if (grade === 5) return "#BAE1FF";
}

export default function Home() {
    const [inputValue, setInputValue] = useState("");
    const [results, displayResults] = useState<Result[]>([]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleButtonClick();
        }
    }
    const handleButtonClick = () => {
        fetchAndDisplay(inputValue);
    };
    const fetchAndDisplay = async (value: string) => {
        const response = await fetch(`/.netlify/functions/fetchResults?query=${value}`);
        const results = await response.json();
        displayResults(results);
    }

    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <input
                type="text"
                className="border border-gray-300 rounded p-2"
                placeholder="Enter text here"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyPress}
            />
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                onClick={handleButtonClick}
            >
              Search
            </a>
          </div>
          <div className="mt-4">
            {results.map((result) => (
                <div key={result.id}>
                  <p style={{backgroundColor: getBGColor(result.grade)}}>{result.subject}</p>
                  <p>{result.memo}</p>
                </div>
            ))}
          </div>
        </main>
      </div>
    );
}
