import { cookies } from "next/headers";

export async function POST() {
  // Delete the cookie
  const cookieStore = await cookies();
  cookieStore.delete("userId");

  // Redirect to login page
  return new Response(
    JSON.stringify({ success: true, message: "Successfully logged out" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
