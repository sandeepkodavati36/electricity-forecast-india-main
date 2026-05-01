import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ChartDataPoint {
  month: string;
  month_num: number;
  bill: number;
  units: number;
  consumption: number;
  ci_lower: number;
  ci_upper: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  metric: string;
}

export default function Chart({ data, metric }: ChartProps) {
  const metricData = data.map(d => d[metric as keyof ChartDataPoint] as number);
  const peakMonth = data.length > 0 ? data.reduce((max, d) => (d[metric as keyof ChartDataPoint] as number) > (max[metric as keyof ChartDataPoint] as number) ? d : max) : null;
  const lowestMonth = data.length > 0 ? data.reduce((min, d) => (d[metric as keyof ChartDataPoint] as number) < (min[metric as keyof ChartDataPoint] as number) ? d : min) : null;

  const chartData: ChartData<'bar', number[], string> = {
    labels: data.map(d => d.month.slice(0,3)),
    datasets: [{
      label: metric === 'bill' ? 'Monthly Bill (₹)' : metric === 'units' ? 'Units (kWh)' : 'Consumption (MU)',
      data: metricData,
      borderColor: '#60a5fa',
      backgroundColor: data.map(d => d.month === peakMonth?.month ? '#ef4444' : d.month === lowestMonth?.month ? '#3b82f6' : '#60a5fa'),
    }],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
        callbacks: {
          label(context) {
            const raw = Number(context.parsed.y ?? context.parsed);
            const formatted = raw.toLocaleString(undefined, {
              maximumFractionDigits: raw % 1 === 0 ? 0 : 2,
            });
            return `${context.dataset.label}: ${formatted}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          callback(value) {
            const numeric = Number(value);
            return numeric.toLocaleString(undefined, {
              maximumFractionDigits: numeric % 1 === 0 ? 0 : 2,
            });
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
        },
      },
      x: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
