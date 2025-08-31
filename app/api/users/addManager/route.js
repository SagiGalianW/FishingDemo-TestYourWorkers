import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {
  try {
    const body = await req.json(); // parse JSON from request body
    const { firstName, lastName, phone, email, password } = body;

    // checking if email or phone already exists
    const exist = await pool.query(
      "SELECT * FROM human WHERE email = $1 OR phone = $2",
      [email, phone]
    );
    if (exist.rows.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "email or phone already exists",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // INSERTING human table
    const res = await pool.query(
      "INSERT INTO human (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING human_id",
      [firstName, lastName, email, phone]
    );

    const id = res.rows[0].human_id;

    // INSERTING manager table
    await pool.query("INSERT INTO manager (human_id, pass) VALUES ($1, $2)", [
      id,
      password,
    ]);

    return new Response(
      JSON.stringify({ success: true, message: "Manager added successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
