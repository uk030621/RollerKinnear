import clientPromise from "@/lib/mongodb";

export async function DELETE() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "dicemanager";
    const db = client.db(dbName);
    await db.collection("rolls").deleteMany({}); // Deletes all rolls
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error clearing history:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
