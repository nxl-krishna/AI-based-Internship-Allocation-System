import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { auth } from "@clerk/nextjs/server"; 
import { PrismaClient } from "@prisma/client";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "National Internship Portal",
  description: "Government of India Internship Allocation System",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  // 1. Fetch User Role to decide what links to show
  let userRole = "GUEST";
  
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true } // Only fetch the role to be fast
    });
    if (dbUser) {
      userRole = dbUser.role; // 'ADMIN' or 'APPLICANT'
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-black font-sans`}>
          
          

          {/* 2. MAIN HEADER */}
          <header className="bg-white py-3 px-4 shadow-sm border-b-4 border-orange-500">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="text-5xl">🏛️</div> 
                   <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-none">
                        Internship Portal
                      </h1>
                      <p className="text-xs font-bold text-gray-600 tracking-wide mt-1 uppercase">
                         Transforming Indian Youth
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-6 opacity-90">
                   <div className="text-center hidden sm:block">
                      <p className="font-bold text-lg text-black font-serif">G2<span className="text-orange-500">0</span></p>
                      <p className="text-[9px] uppercase tracking-wider">Bharat 2025 India</p>
                   </div>
                   <div className="text-center border-l pl-4 border-gray-300 hidden sm:block">
                      <p className="font-bold text-blue-600 italic font-sans text-lg">Digital India</p>
                      <p className="text-[9px] uppercase tracking-wider">Power to Empower</p>
                   </div>
                </div>
             </div>
          </header>

          {/* 3. NAVIGATION BAR (LOGIC CHANGED HERE) */}
          <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
              
              {/* Left Links */}
              <div className="flex gap-6 text-sm font-medium">
                <Link href={userId ? "/home" : "/"} className="hover:text-yellow-400 border-b-2 border-transparent hover:border-yellow-400 transition h-full flex items-center">
                  Home
                </Link>
                
                {/* CONDITIONAL LINKS BASED ON ROLE */}
                {userId && userRole === 'ADMIN' ? (
                   // IF ADMIN: Show Admin Panel Link
                   <Link href="/admin" className="hidden sm:flex text-yellow-300 border-b-2 border-transparent hover:border-yellow-400 transition h-full items-center font-bold">
                     Admin Panel
                   </Link>
                ) : (
                   // IF STUDENT/GUEST: Show Dashboard & About Link
                   <>
                     <Link href="/about" className="hover:text-yellow-400 border-b-2 border-transparent hover:border-yellow-400 transition h-full flex items-center">
                       About Scheme
                     </Link>
                     {userId && (
                       <Link href="/dashboard" className="hidden sm:flex hover:text-yellow-400 border-b-2 border-transparent hover:border-yellow-400 transition h-full items-center">
                         Dashboard
                       </Link>
                     )}
                   </>
                )}
                
                <Link href="/contact" className="hidden sm:flex hover:text-yellow-400 border-b-2 border-transparent hover:border-yellow-400 transition h-full items-center">
                  Contact Us
                </Link>
              </div>
              
              {/* Right: Clerk Auth Buttons */}
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-white hover:text-yellow-400 font-bold bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 border border-orange-400 ">Login</button>
                  </SignInButton>
                  
                </SignedOut>

                <SignedIn>
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-blue-200 hidden sm:block">
                        {userRole === 'ADMIN' ? 'Administrator' : 'Applicant'}
                      </span>
                      <UserButton afterSignOutUrl="/" />
                   </div>
                </SignedIn>
              </div>

            </div>
          </nav>

          <main>{children}</main>
          
          <footer className="bg-gray-800 text-gray-400 text-xs text-center py-4 mt-auto">
             Content is uploaded for academic project purpose only.
          </footer>

        </body>
      </html>
    </ClerkProvider>
  );
}
