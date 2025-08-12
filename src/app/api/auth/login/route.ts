import { NextRequest, NextResponse } from "next/server";
import { verifyStageKey } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { stageKey, username, password } = await request.json();

    if (!stageKey || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const admin = await verifyStageKey(stageKey, username, password);

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username },
    });

    // Set secure cookie
    response.cookies.set("admin-session", admin.stageKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
