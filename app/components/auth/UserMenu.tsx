import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

async function googleSignIn() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

async function googleSignOut() {
  "use server";
  await signOut();
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
      <form action={googleSignIn}>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-[#0E5C58] hover:text-[#0E5C58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
        >
          Sign in
        </button>
      </form>
    );
  }

  const { name, email, image } = session.user;

  return (
    <details className="relative">
      <summary
        className="flex cursor-pointer list-none items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0E5C58] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 [&::-webkit-details-marker]:hidden"
        aria-label={name ? `Account menu for ${name}` : "Account menu"}
      >
        {image ? (
          <img
            src={image}
            alt=""
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {(name ?? email ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
      </summary>

      <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          {name ? (
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {name}
            </p>
          ) : null}
          {email ? (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {email}
            </p>
          ) : null}
        </div>

        <Link
          href="/dashboard"
          className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
        >
          Dashboard
        </Link>

        <form action={googleSignOut}>
          <button
            type="submit"
            className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
          >
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
