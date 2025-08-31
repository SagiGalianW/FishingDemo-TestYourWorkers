"use client";

import React from "react";
import Link from "next/link";

const TopBar = () => {
  const handleLogOut = () => {
    fetch("/api/logout", { method: "POST" })
      .then((res) => res.json()) // parse JSON first
      .then((data) => {
        console.log(data.success);
        if (data.success) window.location.href = "/login";
      })
      .catch(() => alert("Could not log out"));
  };
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>


      <button
        className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </header>
  );
};

export default TopBar;
