import Image from "next/image";

export default function Home() {
  return (
    // 1. Removed "dark:bg-black" from the outer div
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      
      {/* 2. Removed "dark:bg-black" from main */}
      {/* 3. Added "text-black" to make sure font is readable */}
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white text-black sm:items-start">
        <div>
          <h1>welcome back krishna</h1>
        </div>
      </main>
      
    </div>
  );
}