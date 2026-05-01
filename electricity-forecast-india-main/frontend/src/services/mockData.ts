export type Season = 'Summer' | 'Monsoon' | 'Winter';

export interface ForecastPoint {
  month: string;
  month_num: number;
  bill: number;
  units: number;
  consumption: number;
  season: Season;
}

export const STATES = [
  'Tamil Nadu',
  'Maharashtra',
  'Uttar Pradesh',
  'Rajasthan',
  'Gujarat',
  'Karnataka',
  'Andhra Pradesh',
  'West Bengal',
];

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const seasonMap: Season[] = [
  'Winter',
  'Winter',
  'Summer',
  'Summer',
  'Summer',
  'Monsoon',
  'Monsoon',
  'Monsoon',
  'Monsoon',
  'Monsoon',
  'Winter',
  'Winter',
];

const monthlyBase = [
  21000, 20500, 22500, 24500, 26500, 25500,
  25000, 24500, 23800, 23000, 22000, 21500,
];

const stateFactors: Record<string, number> = {
  'Tamil Nadu': 1.00,
  Maharashtra: 1.15,
  'Uttar Pradesh': 0.95,
  Rajasthan: 0.92,
  Gujarat: 1.05,
  Karnataka: 1.08,
  'Andhra Pradesh': 1.02,
  'West Bengal': 0.98,
};

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededNoise(state: string, year: number, monthIndex: number) {
  const seed = hashCode(`${state}-${year}-${monthIndex}`);
  return 0.92 + ((seed % 140) / 1000);
}

export function buildForecast(state: string, year: number): ForecastPoint[] {
  const stateFactor = stateFactors[state] ?? 1;
  const yearGrowth = 1 + (year - 2019) * 0.035 + (year >= 2024 ? 0.01 : 0);

  return monthNames.map((month, index) => {
    const season = seasonMap[index];
    const noise = seededNoise(state, year, index);
    const base = monthlyBase[index];
    const bill = Math.round(base * stateFactor * yearGrowth * noise);
    const units = parseFloat((bill / 7.5 + (index * 12) + stateFactor * 3).toFixed(1));
    const consumption = parseFloat((units / 1000).toFixed(2));

    return {
      month,
      month_num: index + 1,
      bill,
      units,
      consumption,
      season,
    };
  });
}

export function buildStateRanking(year: number) {
  return STATES.map((state) => {
    const forecast = buildForecast(state, year);
    const avgBill = forecast.reduce((sum, item) => sum + item.bill, 0) / forecast.length;
    const peakMonth = forecast.reduce((best, item) => (item.bill > best.bill ? item : best), forecast[0]).month;
    return {
      state,
      avgBill: Math.round(avgBill),
      peakMonth,
    };
  }).sort((a, b) => b.avgBill - a.avgBill);
}
