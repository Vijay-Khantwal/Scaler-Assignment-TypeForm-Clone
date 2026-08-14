export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0eeef]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e4e4e7] border-t-[#3C323E]"></div>
      <p className="mt-4 text-[#655D67] text-sm font-medium animate-pulse">Loading workspace...</p>
    </div>
  );
}
