import { motion } from "motion/react";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Electricity Forecasting System
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Electricity Consumption Forecasting — Indian States
            </h1>
            <p className="mt-2 text-slate-400">
              ML-based forecasting and monthly analysis for state-level energy trends.
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="rounded-3xl bg-slate-900/80 px-4 py-3 text-slate-100 border border-slate-800 shadow-xl shadow-cyan-500/10"
          >
            <p className="text-sm text-cyan-200">Responsive dashboard</p>
            <p className="font-medium">Dynamic state forecasting preview</p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
