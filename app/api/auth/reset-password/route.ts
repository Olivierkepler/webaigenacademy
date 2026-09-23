import { NextResponse } from "next/server";

import { isStrongEnoughPassword } from "@/lib/password";
import {
  getUserIdForValidResetToken,
  deletePasswordResetTokensForUser,
} from "@/lib/password-reset";
import { updateUserPassword } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: unknown;
      password?: unknown;
    };

    const token =
      typeof body.token === "string" ? body.token.trim() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json(
        { error: "Reset token and password are required." },
        { status: 400 }
      );
    }

    if (!isStrongEnoughPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const userId = await getUserIdForValidResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    await updateUserPassword(userId, password);

    // Makes the reset link unusable after password change.
    await deletePasswordResetTokensForUser(userId);

    return NextResponse.json({
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("[reset-password] Unexpected error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}