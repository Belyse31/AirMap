import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatChartTime } from '../../utils/dateUtils';
import { getPollutantName } from '../../utils/airQuality';

export function TimeSeriesChart({ data, pollutants = ['pm25', 'pm10'], height = 300 }) {
  const colors = {
    pm25: '#3b82f6',
    pm10: '#8b5cf6',
    co: '#f59e0b',
    no2: '#ef4444',
  };

  const formattedData = data.map(item => ({
    ...item,
    time: formatChartTime(item.timestamp),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          label={{ value: 'Concentration', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value) => getPollutantName(value)}
        />
        {pollutants.map(pollutant => (
          <Line
            key={pollutant}
            type="monotone"
            dataKey={pollutant}
            stroke={colors[pollutant]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name={pollutant}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
