import { Pool } from "pg";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("userId");
  const managerId = userCookie.value;
  const { subject, text } = await req.json();
  var testId = null;

  // Create a test in the DB
  try {
    const res = await pool.query(
      "INSERT INTO test (manager_id, start_date) VALUES ($1, $2) RETURNING test_id",
      [managerId, new Date()]
    );
    testId = res.rows[0].test_id;
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Database error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Getting all workers - to send them emails
  const res = await pool.query(
    "SELECT * FROM worker JOIN human ON human.human_id = worker.human_id WHERE manager_id = $1",
    [managerId]
  );
  const workers = res.rows;

  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS, // your Gmail email
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
    },
  });

  // Sending emails to all workers
  for (const worker of workers) {
    try {
      await transporter.sendMail({
        from: process.env.GMAIL_ADDRESS,
        to: worker.email, // single email or comma-separated string
        subject: subject,
        text:
          text +
          "\nClick the link:\n" +
          process.env.SELF_APP_DOMAIN +
          "/test?key=" +
          worker.human_id +
          "&test=" +
          testId,
      });
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }
  return new Response(
    JSON.stringify({ success: true, message: "Emails sent to all workers" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
