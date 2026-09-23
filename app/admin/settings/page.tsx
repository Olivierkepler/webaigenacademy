import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Globe2,
  GraduationCap,
  LockKeyhole,
  Mail,
  Palette,
  Save,
  Settings2,
  ShieldCheck,
  UserCog,
} from "lucide-react";

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <Icon className="h-4 w-4 text-slate-500" />
        </div>

        <div>
          <p className="text-[13px] font-medium text-slate-900">
            {title}
          </p>
          <p className="mt-1 max-w-xl text-[12px] leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0 sm:ml-6">{children}</div>
    </div>
  );
}

function Toggle({
  enabled = false,
  label,
}: {
  enabled?: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-slate-500">{label}</span>

      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        className={[
          "relative h-6 w-11 rounded-full transition",
          enabled ? "bg-teal-700" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition",
            enabled ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-7 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-medium text-slate-500">
              Academy configuration
            </span>
          </div>

          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-slate-950">
            Settings
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Configure WebAIgen Academy administration and learning preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
            Demo
          </span>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-700 px-4 text-[12px] font-medium text-white transition hover:bg-teal-800"
          >
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid md:grid-cols-4">
          <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-slate-500">Academy status</p>
                <p className="mt-2 text-[18px] font-semibold text-slate-950">
                  Operational
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Learning platform available
            </p>
          </div>

          <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-slate-500">Administrators</p>
                <p className="mt-2 text-[18px] font-semibold text-slate-950">
                  1
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Users with admin access
            </p>
          </div>

          <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-slate-500">Published courses</p>
                <p className="mt-2 text-[18px] font-semibold text-slate-950">
                  1
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                <BookOpen className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Courses available to learners
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-slate-500">Environment</p>
                <p className="mt-2 text-[18px] font-semibold text-slate-950">
                  Development
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                <Database className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Local Academy environment
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        {/* Main settings */}
        <div className="space-y-5">
          {/* Academy */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-teal-700" />
                <h2 className="text-[14px] font-semibold text-slate-950">
                  Academy
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                General information and learning platform preferences.
              </p>
            </div>

            <SettingRow
              icon={Settings2}
              title="Academy name"
              description="The organization name displayed throughout the administration experience."
            >
              <div className="w-full sm:w-[240px]">
                <input
                  type="text"
                  defaultValue="WebAIgen Academy"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
            </SettingRow>

            <SettingRow
              icon={Globe2}
              title="Academy URL"
              description="Public address learners use to access Academy content."
            >
              <div className="w-full sm:w-[240px]">
                <input
                  type="text"
                  defaultValue="webaigenacademy"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
            </SettingRow>

            <SettingRow
              icon={Palette}
              title="Interface theme"
              description="Default appearance used across the Academy learning experience."
            >
              <select
                defaultValue="system"
                className="h-9 w-full min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-teal-600 sm:w-auto"
              >
                <option value="system">System default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </SettingRow>
          </section>

          {/* Learning */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-700" />
                <h2 className="text-[14px] font-semibold text-slate-950">
                  Learning
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Control learner access, progress and course behavior.
              </p>
            </div>

            <SettingRow
              icon={GraduationCap}
              title="Learner enrollment"
              description="Allow registered learners to start published Academy courses."
            >
              <Toggle enabled label="Enabled" />
            </SettingRow>

            <SettingRow
              icon={Check}
              title="Progress tracking"
              description="Record lesson completion and learner progress across courses."
            >
              <Toggle enabled label="Enabled" />
            </SettingRow>

            <SettingRow
              icon={Clock3}
              title="Continue learning"
              description="Allow learners to resume courses from their most recent lesson."
            >
              <Toggle enabled label="Enabled" />
            </SettingRow>
          </section>

          {/* Notifications */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-teal-700" />
                <h2 className="text-[14px] font-semibold text-slate-950">
                  Notifications
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Configure administrative and learner communication preferences.
              </p>
            </div>

            <SettingRow
              icon={Mail}
              title="New learner notifications"
              description="Notify administrators when a new learner registers with the Academy."
            >
              <Toggle enabled label="Enabled" />
            </SettingRow>

            <SettingRow
              icon={Bell}
              title="Course completion alerts"
              description="Receive notifications when learners complete Academy courses."
            >
              <Toggle label="Disabled" />
            </SettingRow>
          </section>

          {/* Security */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                <h2 className="text-[14px] font-semibold text-slate-950">
                  Security & access
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Administrative access and account security controls.
              </p>
            </div>

            <SettingRow
              icon={UserCog}
              title="Administrator access"
              description="Review users who currently have access to Academy administration."
            >
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-800"
              >
                Manage admins
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </SettingRow>

            <SettingRow
              icon={LockKeyhole}
              title="Authentication"
              description="Academy accounts currently use the configured application authentication providers."
            >
              <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </SettingRow>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-slate-950">
                Administration
              </h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Current Academy configuration.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="px-5 py-4">
                <p className="text-[11px] text-slate-400">
                  Current administrator
                </p>
                <p className="mt-1 text-[13px] font-medium text-slate-900">
                  Test
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  test@gmail.com
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-[11px] text-slate-400">Role</p>
                <div className="mt-2">
                  <span className="rounded-md bg-teal-50 px-2 py-1 text-[11px] font-medium text-teal-700">
                    Administrator
                  </span>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-[11px] text-slate-400">
                  Academy environment
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[12px] font-medium text-slate-700">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-slate-950">
                Quick links
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Common administration destinations.
              </p>
            </div>

            <div className="p-2">
              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <UserCog className="h-4 w-4 text-slate-400" />
                  <span className="text-[12px] font-medium text-slate-700">
                    Manage users
                  </span>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/courses"
                className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-[12px] font-medium text-slate-700">
                    Manage courses
                  </span>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-slate-400" />
                  <span className="text-[12px] font-medium text-slate-700">
                    View analytics
                  </span>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <Database className="h-4 w-4 text-teal-700" />
              </div>

              <div>
                <p className="text-[13px] font-medium text-slate-900">
                  Demo configuration
                </p>

                <p className="mt-1 text-[12px] leading-5 text-slate-500">
                  Settings shown here are currently for interface development.
                  Persistent configuration will be connected to Academy data
                  later.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-slate-700">
              Academy settings
            </p>

            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              Demo
            </span>
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            Interface configuration for WebAIgen Academy administration.
          </p>
        </div>

        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-800"
        >
          View Academy
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}