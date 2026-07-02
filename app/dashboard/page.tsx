import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Not Authenticated
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">

        <h1 className="mb-8 text-3xl font-bold">
          Dashboard
        </h1>

        <div className="space-y-8">

          {/* User */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              User
            </h2>

            <pre className="overflow-auto rounded-lg bg-slate-900 p-5 text-green-400">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </section>

          {/* Session */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Session
            </h2>

            <pre className="overflow-auto rounded-lg bg-slate-900 p-5 text-green-400">
              {JSON.stringify(session, null, 2)}
            </pre>
          </section>

        </div>

      </div>
    </main>
  );
}