"use client";

import React from "react";
import Link from "next/link";

const QuickActions = () => {
  const handleSendMails = async () => {
    try {
      const res = await fetch("/api/sendMails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // optional: send dynamic data
        body: JSON.stringify({
          subject: "Hello",
          text: "This is a test email from FishingDemo!",
        }),
      });

      // Wait for the JSON response
      const data = await res.json();

      if (data.success) {
        setStatus("✅ " + data.message);
      } else {
        setStatus("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending email");
    }
  };
  return (
    <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Quick Actions
      </h3>
      <div className="flex gap-3">
        <Link
          href={`/dashboard?mode=tests`}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          View Tests
        </Link>
        <Link
          href={`/dashboard?mode=workers`}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          View Workers
        </Link>
        <button
          onClick={handleSendMails}
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
