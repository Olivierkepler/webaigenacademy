import { auth, signOut } from "@/auth";
import Link from "next/link";
import UserMenuClient from "./UserMenuClient";

async function googleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function UserMenu() {
  let session = null;

  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-[#0E5C58] hover:text-[#0E5C58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
      >
        Sign in
      </Link>
    );
  }

  const { name, email, image, role } = session.user;

  return (
    <UserMenuClient
      name={name ?? null}
      email={email ?? null}
      image={image ?? null}
      role={role}
      signOutAction={googleSignOut}
    />
  );
}
