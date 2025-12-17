import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function HomePage() {
  const user = await currentUser();

  if (!user) return redirect("/"); // Security: Kick guests out

  // Fetch User Status
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { profile: true }
  });

  const userRole = dbUser?.role || "GUEST";
  const isRegistered = !!dbUser?.profile;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Navbar for Logged In Users */}
      
      {/* Main Hub Content */}
      <main className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome, {user.firstName}! 👋
        </h1>
        <p className="text-slate-500 mb-8">Select where you want to go.</p>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* OPTION 1: ADMIN PANEL (Only for Admins) */}
          {userRole === 'ADMIN' && (
            <Link href="/admin" className="group block p-8 bg-white border border-slate-200 rounded-2xl hover:border-red-500 hover:shadow-md transition">
              <span className="text-3xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600">Admin Console</h3>
              <p className="text-slate-500 mt-2">Manage jobs and run algorithms.</p>
            </Link>
          )}

          {/* OPTION 2: STUDENT DASHBOARD (Only if Registered) */}
          {userRole !== 'ADMIN' && isRegistered && (
            <Link href="/dashboard" className="group block p-8 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
              <span className="text-3xl mb-4 block">📊</span>
              <h3 className="text-xl font-bold">My Dashboard</h3>
              <p className="text-blue-100 mt-2">View your application status and matches.</p>
            </Link>
          )}

          {/* OPTION 3: REGISTRATION (Only if NOT Registered) */}
          {userRole !== 'ADMIN' && !isRegistered && (
            <Link href="/register" className="group block p-8 bg-white border border-yellow-300 rounded-2xl hover:shadow-md transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">ACTION REQUIRED</div>
              <span className="text-3xl mb-4 block">📝</span>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-yellow-700">Complete Registration</h3>
              <p className="text-slate-500 mt-2">You need to create a profile to get matched.</p>
            </Link>
          )}

          

        </div>
      </main>
    </div>
  );
}