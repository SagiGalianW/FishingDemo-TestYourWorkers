// app/home/workers/page.js
import { cookies } from "next/headers";
import { Pool } from "pg";
import AddWorker from "./AddWorker";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function InspectTest({ searchParams }) {
  const testId = searchParams.testId;

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
  const res = await pool.query(
    `SELECT
    human.human_id,
    first_name,
    last_name,
    phone,
    email,
    is_failed
  FROM
    human
  JOIN (
    SELECT
      human_id,
      is_failed
    FROM
      worker
    LEFT JOIN (
      SELECT *
      FROM worker_test
      WHERE test_id = $1
    ) AS r ON worker.human_id = r.worker_id
  ) AS t ON human.human_id = t.human_id`,
    [testId]
  );

  const workers = res.rows;

  if (workers.length === 0) {
    return (
      <div className="flex flex-col p-2 mt-2 items-center justify-center bg-gray-100">
        <AddWorker />
        <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-700">
            No workers found for this test.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Workers that practiced the test
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Worder ID</th>
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Is failed</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.human_id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{w.human_id}</td>
                <td className="py-2 px-4">{w.first_name}</td>
                <td className="py-2 px-4">{w.last_name}</td>
                <td className="py-2 px-4">{w.email}</td>
                <td className="py-2 px-4">{w.phone}</td>
                <td className="py-2 px-4">
                  {w.is_failed ? String(w.is_failed) : "False"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
