import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getUserByEmail } from "@/lib/users";
import { createPasswordResetToken } from "@/lib/password-reset";

const SUCCESS_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
    };

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    // Don't reveal whether an account exists.
    if (!user) {
      return NextResponse.json({
        message: SUCCESS_MESSAGE,
      });
    }

    // Google-only users may not have a password.
    if (!user.passwordHash) {
      return NextResponse.json({
        message: SUCCESS_MESSAGE,
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.PASSWORD_RESET_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!apiKey || !fromEmail || !appUrl) {
      console.error(
        "[forgot-password] Missing email configuration."
      );

      return NextResponse.json(
        { error: "Password reset is temporarily unavailable." },
        { status: 500 }
      );
    }

    const token = await createPasswordResetToken(user.id);

    const resetUrl =
      `${appUrl.replace(/\/$/, "")}/reset-password?token=` +
      encodeURIComponent(token);

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: "Reset your WebAIGen Academy password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Reset your password</h2>

          <p>
            We received a request to reset your WebAIGen Academy password.
          </p>

          <p>
            Click the button below to choose a new password.
          </p>

          <p style="margin: 28px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                background: #0E5C58;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
              "
            >
              Reset password
            </a>
          </p>

          <p style="color: #666; font-size: 14px;">
            This link expires in 30 minutes.
          </p>

          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(
        "[forgot-password] Failed to send reset email:",
        error
      );

      return NextResponse.json(
        { error: "Could not send password reset email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error("[forgot-password] Unexpected error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}