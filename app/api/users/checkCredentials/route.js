import { Pool } from "pg";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {
  try {
    const body = await req.json(); // parse JSON from request body
    const { email, password } = body;

    // Example: check if user exists in DB
    const res = await pool.query(
      "SELECT * FROM human JOIN manager ON human.human_id = manager.human_id WHERE email = $1 AND pass = $2",
      [email, password]
    );

    const id = res.rows[0].human_id;
    const firstName = res.rows[0].firstName;
    const lastName = res.rows[0].lastName;
    const phone = res.rows[0].phone;

    if (res.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const cookieStore = await cookies(); // ✅ await it first

    cookieStore.set("userId", id, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Database error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
