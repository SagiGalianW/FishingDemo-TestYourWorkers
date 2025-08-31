"use client";

import React, { useState } from "react";

export default function AddWorker() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddWorker = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/addWorker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Worker added successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
      } else {
        alert(data.message || "Failed to add worker");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding worker");
    }
  };

  return (
    <form
      onSubmit={handleAddWorker}
      className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl shadow-sm mb-2"
    >
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="flex-1 min-w-[120px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="flex-1 min-w-[120px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 min-w-[180px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="flex-1 min-w-[140px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
