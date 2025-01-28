"use client";

import { useState } from "react";

export default function FibonacciDice() {
  const [roll, setRoll] = useState(null);

  const rollDice = async () => {
    const response = await fetch("/api/roll");
    const data = await response.json();
    setRoll(data.roll);
  };

  return (
    <div>
      <button
        onClick={rollDice}
        style={{ padding: "10px 20px", fontSize: "18px" }}
      >
        Roll Fibonacci Dice
      </button>
      {roll !== null && <p>You rolled: {roll}</p>}
    </div>
  );
}
