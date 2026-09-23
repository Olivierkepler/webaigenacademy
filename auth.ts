import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { resolveUserRole } from "@/lib/admin";
import { verifyPassword } from "@/lib/password";
import { getUserByEmail, getUserById, upsertOAuthUser } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user?.passwordHash) {
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      try {
        await upsertOAuthUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      } catch (error) {
        console.error("[auth] Failed to upsert user on sign-in:", error);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        if (typeof user.id === "string") {
          token.userId = user.id;
        }
        if (typeof user.email === "string") {
          token.email = user.email;
        }
        token.name = user.name ?? null;
        token.picture = user.image ?? null;
      }

      const email =
        typeof token.email === "string" ? token.email : null;

      token.role = resolveUserRole(email);

      if (email && !token.userId) {
        try {
          const dbUser = await getUserByEmail(email);
          if (dbUser) {
            token.userId = dbUser.id;
          }
        } catch (error) {
          console.error("[auth] Failed to load user id for JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      const userId =
        typeof token.userId === "string" ? token.userId : null;

      if (session.user && userId) {
        session.user.id = userId;

        try {
          const dbUser = await getUserById(userId);
          if (dbUser) {
            session.user.email = dbUser.email;
            session.user.name = dbUser.name;
            session.user.image = dbUser.image;
          }
        } catch (error) {
          console.error("[auth] Failed to load user for session:", error);
        }
      }

      if (session.user) {
        const email =
          session.user.email ??
          (typeof token.email === "string" ? token.email : null);
        session.user.role = resolveUserRole(email);
      }

      return session;
    },
  },
});
