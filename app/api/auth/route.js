import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

/**
 * POST /api/auth — checks the dashboard password and sets an auth cookie on success.
 * GET /api/auth — returns whether the current visitor is authenticated.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    const dashboardPassword = process.env.DASHBOARD_PASSWORD;

    if (!dashboardPassword) {
      return Response.json(
        { error: "Dashboard password is not configured" },
        { status: 500 }
      );
    }

    if (password !== dashboardPassword) {
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(AUTH_COOKIE_NAME)?.value === "true";

  return Response.json({ authenticated: isAuthenticated });
}

/**
 * DELETE /api/auth — clears the dashboard auth cookie (logout).
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return Response.json({ success: true });
}
