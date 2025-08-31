// app/home/workers/page.js
import { cookies } from "next/headers";
import { Pool } from "pg";
import Link from "next/link";   

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function Tests() {
  // Get the userId from cookies
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId");

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

  const managerId = userIdCookie.value;

  // Fetch all workers assigned to this manager
  const res = await pool.query("SELECT * FROM test");

  const tests = res.rows;

  if (tests.length === 0) {
    return (
      <div className="flex flex-col p-2 mt-2 items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-700">
            No tests found for this manager.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Tests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Test ID</th>
              <th className="py-3 px-4 text-left">Year</th>
              <th className="py-3 px-4 text-left">Month</th>
              <th className="py-3 px-4 text-left">Day</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.test_id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{t.test_id}</td>
                <td className="py-2 px-4">{t.start_date.getFullYear()}</td>
                <td className="py-2 px-4">{t.start_date.getMonth() + 1}</td>
                <td className="py-2 px-4">{t.start_date.getDate()}</td>
                <td className="py-2 px-4">
                    {/* Wrap the button with a Next.js Link component */}
                    <Link href={`/dashboard?mode=inspectTest&testId=${t.test_id}`} passHref>
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        View Results
                      </button>
                    </Link>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
