import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getForecast } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ForecastData {
  month: string;
  month_num: number;
  bill: number;
  units: number;
  consumption: number;
  ci_lower: number;
  ci_upper: number;
}

interface YearOverYearChartProps {
  state: string;
  metric: string;
}

export default function YearOverYearChart({ state, metric }: YearOverYearChartProps) {
  const [data, setData] = useState<{ [year: number]: ForecastData[] }>({});

  const years = [2025, 2026, 2027];

  useEffect(() => {
    const fetchAllYears = async () => {
      const yearData: { [year: number]: ForecastData[] } = {};
      for (const year of years) {
        try {
          const res = await getForecast(state, year);
          yearData[year] = res.data || [];
        } catch (err) {
          console.error(`Error fetching data for ${year}:`, err);
        }
      }
      setData(yearData);
    };
    fetchAllYears();
  }, [state, metric]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: years.map((year, i) => ({
      label: year.toString(),
      data: data[year]?.map(d => d[metric as keyof ForecastData] as number) || [],
      borderColor: `hsl(${i * 60}, 70%, 50%)`,
      backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}