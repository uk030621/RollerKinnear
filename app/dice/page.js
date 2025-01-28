"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DicePage() {
  const [roll, setRoll] = useState(null);
  const [limit, setLimit] = useState(10);
  const [maxNumber, setMaxNumber] = useState(100);
  const [useLimit, setUseLimit] = useState(true); // Toggle between limit and max number
  const [history, setHistory] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [animation, setAnimation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  // Fetch roll history on load
  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch("/api/history");
      const data = await response.json();
      setHistory(data.rolls || []);
    };
    fetchHistory();
  }, []);

  const rollDice = async () => {
    const randomAnimation = `animate-rock-${Math.floor(Math.random() * 3) + 1}`;
    setAnimation(randomAnimation);
    setIsShaking(true);

    setTimeout(async () => {
      setIsShaking(false);

      const response = await fetch("/api/roll", {
        method: "POST",
        body: JSON.stringify(useLimit ? { limit } : { maxNumber }), // Send limit or maxNumber
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setRoll(data.roll);

      setHistory([{ roll: data.roll, createdAt: new Date() }, ...history]);
    }, 500);
  };

  const clearHistory = async () => {
    const response = await fetch("/api/clear", { method: "DELETE" });
    if (response.ok) {
      setHistory([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      <div className="bg-white mt-6 shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <Link
          className="flex text-sm text-white rounded-md items-start w-fit bg-slate-900 py-1 px-2 mb-3 ml-2"
          href="/"
        >
          Back ⬅️
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Fibonacci Dice
        </h1>

        {/* Mode Toggle */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Select Fibonacci Mode:
          </label>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setUseLimit(true)}
              className={`px-4 py-2 rounded-lg ${
                useLimit
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Limit
            </button>
            <button
              onClick={() => setUseLimit(false)}
              className={`px-4 py-2 rounded-lg ${
                !useLimit
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Maximum Number
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-4">
          {useLimit ? (
            <div>
              <label className="block text-gray-700">
                Fibonacci Limit (Position):
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded-lg px-3 py-1 w-full mt-2"
              />
            </div>
          ) : (
            <div>
              <label className="block text-gray-700">
                Maximum Number in Sequence:
              </label>
              <input
                type="number"
                value={maxNumber}
                onChange={(e) => setMaxNumber(Number(e.target.value))}
                className="border rounded-lg px-3 py-1 w-full mt-2"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={rollDice}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          Roll Dice
        </button>
        <button
          onClick={clearHistory}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition mt-4 ml-4"
        >
          Clear History
        </button>

        {/* Dice Animation */}
        {roll !== null && (
          <div className="flex justify-center items-center mt-4">
            <div
              className={`w-20 h-20 flex justify-center items-center border-2 border-gray-400 bg-white rounded-lg text-xl font-bold text-blue-600 shadow-md ${
                isShaking ? animation : ""
              }`}
            >
              {roll}
            </div>
          </div>
        )}

        {/* Explanatory Dropdown */}
        <div className="mt-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-sm text-gray-600 hover:underline"
          >
            {isDropdownOpen ? "Hide Explanation" : "How does this work?"}
          </button>
          {isDropdownOpen && (
            <div className="mt-4 text-left text-sm bg-gray-50 border rounded-lg p-4">
              <p className="text-gray-800">
                This system generates random numbers from the Fibonacci sequence
                based on the selected mode:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>
                  <strong>Limit Mode:</strong> Generates numbers from the
                  Fibonacci sequence up to the specified position (e.g., 10th
                  Fibonacci number).
                </li>
                <li>
                  <strong>Maximum Number Mode:</strong> Generates Fibonacci
                  numbers less than or equal to the specified maximum value
                  (e.g., all Fibonacci numbers below 100).
                </li>
              </ul>
              <p className="text-gray-800 mt-2">
                Use the <strong>Clear History</strong> button to reset the roll
                history.
              </p>
            </div>
          )}
        </div>

        {/* Roll History */}
        {history.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-bold text-gray-800">Roll History:</h3>
            <ul className="text-gray-700 text-sm">
              {history.map((r, index) => (
                <li key={index}>
                  Roll {history.length - index}: {r.roll} (at{" "}
                  {new Date(r.createdAt).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
