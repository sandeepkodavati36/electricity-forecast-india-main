import { useEffect, useState, useMemo } from 'react';
import { getForecast } from '../services/api';
import Chart from './Chart';
import Controls from './Controls';
import YearOverYearChart from './YearOverYearChart';
import StateRankingTable from './StateRankingTable';
import { motion } from 'motion/react';

interface ForecastData {
  month: string;
  month_num: number;
  bill: number;
  units: number;
  consumption: number;
  ci_lower: number;
  ci_upper: number;
}

export default function Dashboard() {
  const [state, setState] = useState('Tamil Nadu');
  const [year, setYear] = useState(2025);
  const [metric, setMetric] = useState<'bill' | 'units' | 'consumption'>('bill');
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const states = [
    'Tamil Nadu',
    'Maharashtra',
    'Uttar Pradesh',
    'Rajasthan',
    'Gujarat',
    'Karnataka',
    'Andhra Pradesh',
    'West Bengal',
  ];

  const years = [2025, 2026, 2027];

  const metrics = [
    { value: 'bill' as const, label: 'Monthly Bill (₹)' },
    { value: 'units' as const, label: 'Units (kWh)' },
    { value: 'consumption' as const, label: 'Consumption (MU)' },
  ];

  useEffect(() => {
    fetchData();
  }, [state, year, metric]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getForecast(state, year);
      setData(res);
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setError('Failed to fetch forecast data. Is the backend running on http://localhost:8000?');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const { metricData, peakMonth, lowestMonth, annualTotal, averageMonthly, seasonalAverages } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        metricData: [],
        peakMonth: null,
        lowestMonth: null,
        annualTotal: 0,
        averageMonthly: 0,
        seasonalAverages: [],
      };
    }

    const metricData = data.map(d => d[metric as keyof ForecastData] as number);
    const peakMonth = data.reduce((max, d) => (d[metric as keyof ForecastData] as number) > (max[metric as keyof ForecastData] as number) ? d : max);
    const lowestMonth = data.reduce((min, d) => (d[metric as keyof ForecastData] as number) < (min[metric as keyof ForecastData] as number) ? d : min);
    const annualTotal = metricData.reduce((sum, val) => sum + val, 0);
    const averageMonthly = annualTotal / 12;

    const seasons = {
      summer: [3, 4, 5],
      monsoon: [6, 7, 8, 9],
      winter: [10, 11, 0, 1, 2],
    };

    const seasonalAverages = Object.entries(seasons).map(([season, months]) => ({
      season,
      average: months.reduce((sum, m) => sum + (metricData[m] || 0), 0) / months.length,
    }));

    return {
      metricData,
      peakMonth,
      lowestMonth,
      annualTotal,
      averageMonthly,
      seasonalAverages,
    };
  }, [data, metric]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Select Forecast Parameters</h2>
        <Controls
          state={state}
          setState={setState}
          year={year}
          setYear={setYear}
          metric={metric}
          setMetric={setMetric}
          states={states}
          years={years}
          metrics={metrics}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 flex items-center justify-center">
          <div className="text-neutral-400">Loading forecast data...</div>
        </div>
      )}

      {!loading && data && data.length > 0 && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-400 mb-2">Peak Month</h4>
              <p className="text-2xl font-bold text-white">{peakMonth?.month}</p>
              <p className="text-sm text-neutral-400">{peakMonth ? (peakMonth[metric as keyof ForecastData] as number).toFixed(2) : ''}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Lowest Month</h4>
              <p className="text-2xl font-bold text-white">{lowestMonth?.month}</p>
              <p className="text-sm text-neutral-400">{lowestMonth ? (lowestMonth[metric as keyof ForecastData] as number).toFixed(2) : ''}</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-400 mb-2">Annual Total</h4>
              <p className="text-2xl font-bold text-white">{annualTotal.toFixed(2)}</p>
              <p className="text-sm text-neutral-400">for {year}</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-400 mb-2">Average Monthly</h4>
              <p className="text-2xl font-bold text-white">{averageMonthly.toFixed(2)}</p>
              <p className="text-sm text-neutral-400">units</p>
            </div>
          </div>

          {/* Monthly Grid */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Monthly Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.map((d, i) => {
                const value = d[metric as keyof ForecastData] as number;
                const isPeak = d.month === peakMonth?.month;
                const isLowest = d.month === lowestMonth?.month;
                const season = i >= 3 && i <= 5 ? 'Summer' : i >= 6 && i <= 9 ? 'Monsoon' : 'Winter';
                return (
                  <div key={d.month} className={`rounded-lg p-4 border ${isPeak ? 'bg-red-500/10 border-red-500/50' : isLowest ? 'bg-blue-500/10 border-blue-500/50' : 'bg-neutral-800 border-neutral-700'}`}>
                    <h5 className="text-sm font-medium text-neutral-400 mb-1">{d.month.slice(0,3)}</h5>
                    <p className="text-lg font-bold text-white">{value.toFixed(0)}</p>
                    <p className="text-xs text-neutral-500">{season}</p>
                    <div className="mt-2 bg-neutral-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(value / Math.max(...metricData)) * 100}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seasonal Summary */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Seasonal Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seasonalAverages.map(({ season, average }) => (
                <div key={season} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-400 mb-2 capitalize">{season}</h4>
                  <p className="text-2xl font-bold text-white">{average.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {state} - {year} {metrics.find(m => m.value === metric)?.label}
            </h3>
            <Chart data={data} metric={metric} />
          </div>

          {/* Year-over-Year Chart */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Year-over-Year Comparison</h3>
            <YearOverYearChart state={state} metric={metric} />
          </div>

          {/* State Ranking Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">State Ranking by Average Annual Bill</h3>
            <StateRankingTable year={year} metric={metric} />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Forecast Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left py-2 px-4">Month</th>
                    <th className="text-right py-2 px-4">Bill (₹)</th>
                    <th className="text-right py-2 px-4">90% CI Lower (₹)</th>
                    <th className="text-right py-2 px-4">90% CI Upper (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                      <td className="py-3 px-4">{row.month}</td>
                      <td className="text-right py-3 px-4 font-semibold text-blue-400">
                        ₹{row.bill.toFixed(0)}
                      </td>
                      <td className="text-right py-3 px-4 text-neutral-400">
                        ₹{row.ci_lower.toFixed(0)}
                      </td>
                      <td className="text-right py-3 px-4 text-neutral-400">
                        ₹{row.ci_upper.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
