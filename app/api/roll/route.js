import { generateFibonacci } from "@/utils/fibonacci";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { limit, maxNumber } = await req.json(); // Accept both values

  let fibSequence;

  if (limit !== undefined) {
    // Generate Fibonacci sequence up to the given position
    fibSequence = generateFibonacci(limit || 10);
  } else if (maxNumber !== undefined) {
    // Generate Fibonacci numbers up to a certain max value
    fibSequence = [];
    let a = 0,
      b = 1;
    while (a <= maxNumber) {
      fibSequence.push(a);
      [a, b] = [b, a + b]; // Move to next Fibonacci number
    }
  } else {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
    });
  }

  if (fibSequence.length === 0) {
    return new Response(
      JSON.stringify({ error: "No Fibonacci numbers found" }),
      {
        status: 400,
      }
    );
  }

  // Select a random Fibonacci number from the sequence
  const randomIndex = Math.floor(Math.random() * fibSequence.length);
  const randomFib = fibSequence[randomIndex];

  // Save the roll in the database
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "dicemanager";
    const db = client.db(dbName);
    await db
      .collection("rolls")
      .insertOne({ roll: randomFib, createdAt: new Date() });
  } catch (error) {
    console.error("Error saving to database:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ roll: randomFib }), {
    headers: { "Content-Type": "application/json" },
  });
}
