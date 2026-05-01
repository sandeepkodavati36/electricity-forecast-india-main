type MetricKey = 'bill' | 'units' | 'consumption';

interface MetricOption {
  value: MetricKey;
  label: string;
}

interface ControlsProps {
  state: string;
  setState: (state: string) => void;
  year: number;
  setYear: (year: number) => void;
  metric: MetricKey;
  setMetric: (metric: MetricKey) => void;
  states: string[];
  years: number[];
  metrics: MetricOption[];
}

export default function Controls({
  state,
  setState,
  year,
  setYear,
  metric,
  setMetric,
  states,
  years,
  metrics,
}: ControlsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Select State
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-cyan-400 hover:border-slate-600 transition"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Select Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-cyan-400 hover:border-slate-600 transition"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Metric
        </label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricKey)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-cyan-400 hover:border-slate-600 transition"
        >
          {metrics.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
