import React from "react";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const page = async ({ searchParams }) => {
  const workerId = searchParams.key;
  const testId = searchParams.test;

  try {
    const res = await pool.query(
      "INSERT INTO worker_test (worker_id, test_id, is_failed) VALUES ($1, $2, $3)",
      [workerId, testId, true]
    );
    console.log(res);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ❌ You failed the test!
          </h1>
          <p className="text-gray-700 mb-6">
            I am very disappointed in you, please try harder next time.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p>
              <span className="font-semibold">Worker ID:</span> {workerId}
            </p>
            <p>
              <span className="font-semibold">Test ID:</span> {testId}
            </p>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            ⚠️ You failed the test MORE THAN ONCE!
          </h1>
          <p className="text-gray-700 mb-6">
            I am very disappointed in you, repeated failure detected.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p>
              <span className="font-semibold">Worker ID:</span> {workerId}
            </p>
            <p>
              <span className="font-semibold">Test ID:</span> {testId}
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default page;
