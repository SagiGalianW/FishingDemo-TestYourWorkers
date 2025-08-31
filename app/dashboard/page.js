// app/home/page.js
import { cookies } from "next/headers";
import { Pool } from "pg";
import TopBar from "../components/UI/TopBar";
import Workers from "../components/UI/Workers";
import QuickActions from "../components/UI/QuickActions";
import Tests from "../components/UI/Tests";
import InspectTest from "../components/UI/InspectTest";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function HomePage({ searchParams }) {
  const mode = searchParams?.mode || "workers";
  const cookieStore = await cookies();
  const userIdCookie = await cookieStore.get("userId");

  if (!userIdCookie) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-red-500">
            Please log in first
          </h1>
        </div>
      </div>
    );
  }

  const userId = userIdCookie.value;

  // Fetch user from DB using the ID
  const res = await pool.query(
    "SELECT first_name, last_name, email, phone FROM human WHERE human_id = $1",
    [userId]
  );

  if (res.rows.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-red-500">
            User not found. Please log in again.
          </h1>
        </div>
      </div>
    );
  }

  const user = res.rows[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome back, {user.first_name} {user.last_name} 👋
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              User Info
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {user.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">User ID:</span> {userId}
            </p>
          </div>
          <QuickActions />
        </div>
        {mode == "workers" && <Workers />}
        {mode == "tests" && <Tests />}
        {mode == "inspectTest" && <InspectTest searchParams={searchParams} />}
      </main>
    </div>
  );
}
