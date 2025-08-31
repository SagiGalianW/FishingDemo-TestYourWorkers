import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("userId");

  if (!userCookie) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Credentials Expired, Try to log in again",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Successfully got the user details",
      userCookie,
    })
  );
}
