import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { sql } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return true;
      }

      try {
        await sql`
          INSERT INTO users (email, name, image)
          VALUES (${user.email}, ${user.name ?? null}, ${user.image ?? null})
          ON CONFLICT (email)
          DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image
        `;
      } catch (error) {
        console.error("[auth] Failed to upsert user on sign-in:", error);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const rows = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `;

          const id = rows[0]?.id;
          if (typeof id === "string") {
            token.userId = id;
          }
        } catch (error) {
          console.error("[auth] Failed to load user id for JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }

      return session;
    },
  },
});
