import SystemMonitor from "./SystemMonitor";


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-2xl w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">System Monitor Portfolio</h1>
          <p className="text-slate-400 text-lg">
            Showcasing <span className="text-blue-400 font-semibold">Go</span> performance and
            <span className="text-cyan-400 font-semibold"> React</span> reactivity.
          </p>
        </header>

        <SystemMonitor />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
          <div className="p-4 border border-slate-900 rounded-lg">
            <h4 className="text-slate-300 font-bold mb-1">Backend</h4>
            <p>Go routines polling OS-level CPU metrics every 1000ms.</p>
          </div>
          <div className="p-4 border border-slate-900 rounded-lg">
            <h4 className="text-slate-300 font-bold mb-1">Frontend</h4>
            <p>Next.js 15 with Tailwind CSS and WebSocket hooks.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
