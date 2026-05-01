import { useEffect, useState } from 'react';
import { getForecast } from '../services/api';

interface ForecastData {
  month: string;
  month_num: number;
  bill: number;
  units: number;
  consumption: number;
  ci_lower: number;
  ci_upper: number;
}

interface StateRankingTableProps {
  year: number;
  metric: string;
}

export default function StateRankingTable({ year, metric }: StateRankingTableProps) {
  const [rankings, setRankings] = useState<{ state: string; avgBill: number; peakMonth: string }[]>([]);

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

  useEffect(() => {
    const fetchRankings = async () => {
      const stateData: { state: string; avgBill: number; peakMonth: string }[] = [];
      for (const state of states) {
        try {
          const res = await getForecast(state, year);
          const data = res.data;
          if (data && data.length > 0) {
            const metricData = data.map((d: ForecastData) => d[metric as keyof ForecastData] as number);
            const avgBill = metricData.reduce((sum: number, val: number) => sum + val, 0) / 12;
            const peakMonth = data.reduce((max: ForecastData, d: ForecastData) => (d[metric as keyof ForecastData] as number) > (max[metric as keyof ForecastData] as number) ? d : max).month;
            stateData.push({ state, avgBill, peakMonth });
          }
        } catch (err) {
          console.error(`Error fetching data for ${state}:`, err);
        }
      }
      stateData.sort((a, b) => b.avgBill - a.avgBill);
      setRankings(stateData);
    };
    fetchRankings();
  }, [year, metric]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left py-2 px-4">Rank</th>
            <th className="text-left py-2 px-4">State</th>
            <th className="text-right py-2 px-4">Avg {metric === 'bill' ? 'Bill (₹)' : metric === 'units' ? 'Units (kWh)' : 'Consumption (MU)'}</th>
            <th className="text-left py-2 px-4">Peak Month</th>
            <th className="text-left py-2 px-4">Bar</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((row, idx) => (
            <tr key={row.state} className="border-b border-neutral-800 hover:bg-neutral-800/50">
              <td className="py-3 px-4">{idx + 1}</td>
              <td className="py-3 px-4">{row.state}</td>
              <td className="py-3 px-4 text-right">{row.avgBill.toFixed(2)}</td>
              <td className="py-3 px-4">{row.peakMonth}</td>
              <td className="py-3 px-4">
                <div className="bg-neutral-700 rounded-full h-2 w-20">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(row.avgBill / Math.max(...rankings.map(r => r.avgBill))) * 100}%` }}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}